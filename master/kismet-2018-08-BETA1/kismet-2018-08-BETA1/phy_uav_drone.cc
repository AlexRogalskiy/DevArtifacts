/*
    This file is part of Kismet

    Kismet is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Kismet is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Kismet; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

*/

#include "config.h"

#include "phy_uav_drone.h"
#include "phy_80211.h"
#include "kis_httpd_registry.h"
#include "devicetracker.h"

void uav_manuf_match::set_uav_manuf_ssid_regex(const std::string& in_regexstr) {
#ifdef HAVE_LIBPCRE
    const char *compile_error, *study_error;
    int erroroffset;
    std::ostringstream errordesc;

    re = pcre_compile(in_regexstr.c_str(), 0, &compile_error, &erroroffset, NULL);

    if (re == NULL) {
        errordesc << "Could not parse PCRE expression: " << compile_error << 
            "at character " << erroroffset << " (" << in_regexstr.substr(erroroffset, 5) <<
            ")";
        throw std::runtime_error(errordesc.str());
    }

    study = pcre_study(re, 0, &study_error);
    
    if (study_error != NULL) {
        errordesc << "Could not parse PCRE expression, optimization failure: " << study_error;
        throw std::runtime_error(errordesc.str());
    }
#else
    throw std::runtime_error("Cannot set PCRE match for SSID; Kismet was not compiled with PCRE "
            "support");
#endif

    uav_manuf_ssid_regex->set(in_regexstr);
}

bool uav_manuf_match::match_record(const mac_addr& in_mac, const std::string& in_ssid) {
    if (get_uav_manuf_mac().longmac != 0) {
        if (get_uav_manuf_mac() == in_mac) {
            if (get_uav_manuf_partial() || get_uav_manuf_ssid_regex() == "")
                return true;
        } else {
            return false;
        }
    }

#ifdef HAVE_LIBPCRE
    int ovector[128];
    int r;

    r = pcre_exec(re, study, in_ssid.c_str(), in_ssid.length(), 0, 0, ovector, 128);

    if (r >= 0)
        return true;
#endif

    return false;
}


Kis_UAV_Phy::Kis_UAV_Phy(GlobalRegistry *in_globalreg,
        Devicetracker *in_tracker, int in_phyid) :
    Kis_Phy_Handler(in_globalreg, in_tracker, in_phyid),
    Kis_Net_Httpd_CPPStream_Handler() {

    phyname = "UAV";

    packetchain =
        Globalreg::FetchGlobalAs<Packetchain>(globalreg, "PACKETCHAIN");

	pack_comp_common = 
		packetchain->RegisterPacketComponent("COMMON");
    pack_comp_80211 =
        packetchain->RegisterPacketComponent("PHY80211");
    pack_comp_device =
        packetchain->RegisterPacketComponent("DEVICE");

    uav_device_id =
        Globalreg::globalreg->entrytracker->RegisterField("uav.device",
                TrackerElementFactory<uav_tracked_device>(),
                "UAV device");

    manuf_match_vec =
        std::make_shared<TrackerElementVector>();

    // Tag into the packet chain at the very end so we've gotten all the other tracker
    // elements already
    packetchain->RegisterHandler(Kis_UAV_Phy::CommonClassifier, this, CHAINPOS_TRACKER, 65535);

    // Register js module for UI
    auto httpregistry = 
        Globalreg::FetchGlobalAs<Kis_Httpd_Registry>(globalreg, "WEBREGISTRY");
    httpregistry->register_js_module("kismet_ui_uav", "/js/kismet.ui.uav.js");

    // Parse the ssid regex options
    auto uav_lines = globalreg->kismet_config->FetchOptVec("uav_match");
    for (auto l : uav_lines)
        parse_manuf_definition(l);

}

Kis_UAV_Phy::~Kis_UAV_Phy() {

}


void Kis_UAV_Phy::LoadPhyStorage(SharedTrackerElement in_storage, SharedTrackerElement in_device) {
    if (in_storage == NULL || in_device == NULL)
        return;

    auto storage_map =
        TrackerElement::safe_cast_as<TrackerElementMap>(in_storage);

    // Does the imported record have UAV?
    auto devi = storage_map->find(uav_device_id);

    if (devi != storage_map->end()) {
        auto uavdev =
            std::make_shared<uav_tracked_device>(uav_device_id, 
                    TrackerElement::safe_cast_as<TrackerElementMap>(devi->second));

        TrackerElement::safe_cast_as<TrackerElementMap>(in_device)->insert(uavdev);
    }
}

int Kis_UAV_Phy::CommonClassifier(CHAINCALL_PARMS) {
    Kis_UAV_Phy *uavphy = (Kis_UAV_Phy *) auxdata;

    devicelist_scope_locker listlocker(uavphy->devicetracker);

	kis_common_info *commoninfo =
		(kis_common_info *) in_pack->fetch(uavphy->pack_comp_common);

    dot11_packinfo *dot11info = 
        (dot11_packinfo *) in_pack->fetch(uavphy->pack_comp_80211);

	kis_tracked_device_info *devinfo =
		(kis_tracked_device_info *) in_pack->fetch(uavphy->pack_comp_device);

	if (devinfo == NULL) {
        return 1;
	}

    if (commoninfo == NULL || dot11info == NULL)
        return 1;

    // Try to pull the existing basedev, we don't want to re-parse
    for (auto di : devinfo->devrefs) {
        std::shared_ptr<kis_tracked_device_base> basedev = di.second;

        if (basedev == NULL)
            return 1;

        // Only compare to the AP device for droneid and SSID matching
        if (basedev->get_macaddr() != dot11info->bssid_mac)
            continue;

        local_locker devlock(&(basedev->device_mutex));

        if (dot11info->droneid != NULL) {
            try {
                if (dot11info->droneid->subcommand() == 0x00) {
                    // DJI Mavic firmware has known bugs where it sends completely blank
                    // droneID frames.  Known affected firmware includes:
                    //
                    // Mavic V01.04.0100 
                    // Mavic V01.04.0200
                    //
                    // Look for subcommand of 0, with 0 content
                    if (dot11info->droneid->raw_record_data().substr(0, 32).find_first_not_of(std::string("\x00", 1)) == std::string::npos) {
                        auto uavdev =
                            basedev->get_sub_as<uav_tracked_device>(uavphy->uav_device_id);

                        if (uavdev == nullptr) {
                            uavdev =
                                std::make_shared<uav_tracked_device>(uavphy->uav_device_id);
                            basedev->insert(uavdev);
                        }

                        uavdev->set_uav_manufacturer("DJI");
                        uavdev->set_uav_model("Mavic (Broken firmware)");
                        uavdev->set_uav_match_type("DroneID");
                    }

                } 

                auto flightinfo = dot11info->droneid->flight_reg_record();
                if (flightinfo != nullptr) {
                    auto uavdev =
                        basedev->get_sub_as<uav_tracked_device>(uavphy->uav_device_id);

                    if (uavdev == nullptr) {
                        uavdev =
                            std::make_shared<uav_tracked_device>(uavphy->uav_device_id);
                        basedev->insert(uavdev);
                    }

                    if (flightinfo->state_serial_valid()) {
                        uavdev->set_uav_serialnumber(MungeToPrintable(flightinfo->serialnumber()));
                    }

                    std::shared_ptr<uav_tracked_telemetry> telem = uavdev->new_telemetry();
                    telem->from_droneid_flight_reg(flightinfo);
                    telem->set_telem_timestamp(ts_to_double(in_pack->ts));

                    uavdev->set_tracker_last_telem_loc(telem);

                    auto tvec = uavdev->get_uav_telem_history();

                    tvec->push_back(telem);

                    if (tvec->size() > 128)
                        tvec->erase(tvec->begin());

                    uavdev->set_uav_match_type("DroneID");

                    if (uavdev->get_uav_manufacturer() == "")
                        uavdev->set_uav_manufacturer("DJI/DroneID");

                    // Set the home location
                    if (flightinfo->home_lat() != 0 && flightinfo->home_lon() != 0) {
                        auto homeloc = uavdev->get_home_location();
                        homeloc->set(flightinfo->home_lat(), flightinfo->home_lon());
                    }
                } 
               
                auto flightpurpose = dot11info->droneid->flight_purpose_record();
                if (flightpurpose != NULL) {
                    auto uavdev =
                        basedev->get_sub_as<uav_tracked_device>(uavphy->uav_device_id);

                    if (uavdev == NULL) {
                        uavdev =
                            std::make_shared<uav_tracked_device>(uavphy->uav_device_id);
                        basedev->insert(uavdev);
                    }

                    uavdev->set_uav_serialnumber(MungeToPrintable(flightpurpose->serialnumber()));
                    uavdev->set_uav_match_type("DroneID");

                    if (uavdev->get_uav_manufacturer() == "")
                        uavdev->set_uav_manufacturer("DJI/DroneID");
                } 
            } catch (const std::exception& e) {
                fprintf(stderr, "debug - unable to parse droneid frame - %s\n", e.what());
            }
        }
        
        if (dot11info->new_adv_ssid &&
                dot11info->type == packet_management && 
                (dot11info->subtype == packet_sub_beacon ||
                 dot11info->subtype == packet_sub_probe_resp)) {

            for (auto mi : *(uavphy->manuf_match_vec)) {
                auto m = std::static_pointer_cast<uav_manuf_match>(mi);

                if (m->match_record(dot11info->bssid_mac, dot11info->ssid)) {
                    auto uavdev =
                        basedev->get_sub_as<uav_tracked_device>(uavphy->uav_device_id);

                    if (uavdev == nullptr) {
                        uavdev =
                            std::make_shared<uav_tracked_device>(uavphy->uav_device_id);
                        basedev->insert(uavdev);
                        uavdev->set_uav_manufacturer(m->get_uav_manuf_name());
                        uavdev->set_uav_model(m->get_uav_manuf_model());
                    }

                    uavdev->set_tracker_matched_type(m);

                    uavdev->set_uav_match_type("UAV Fingerprint");

                    break;
                }
            }
        }
    }

    return 1;
}


bool Kis_UAV_Phy::Httpd_VerifyPath(const char *path, const char *method) {
    if (strcmp(method, "GET") == 0) {
        std::string stripped = Httpd_StripSuffix(path);

        if (stripped == "/phy/phyuav/manuf_matchers")
            return true;

    }

    return false;
}

void Kis_UAV_Phy::Httpd_CreateStreamResponse(Kis_Net_Httpd *httpd,
        Kis_Net_Httpd_Connection *connection,
        const char *url, const char *method, const char *upload_data,
        size_t *upload_data_size, std::stringstream &stream) {

    if (strcmp(method, "GET") != 0) {
        return;
    }

    std::string stripped = Httpd_StripSuffix(url);

    if (stripped == "/phy/phyuav/manuf_matchers") {
        local_locker lock(&uav_mutex);
        Globalreg::globalreg->entrytracker->Serialize(httpd->GetSuffix(url), stream, 
                manuf_match_vec, NULL);
        return;
    }

    return;
}

int Kis_UAV_Phy::Httpd_PostComplete(Kis_Net_Httpd_Connection *concls) {
    return 0;
}

bool Kis_UAV_Phy::parse_manuf_definition(std::string in_def) {
    local_locker lock(&uav_mutex);

    size_t cpos = in_def.find(':');

    if (cpos == std::string::npos) {
        _MSG("Invalid 'uav_match' configuration line, expected 'name:option1=\"...\","  
                "option2=\"...\" but got '" + in_def + "'", MSGFLAG_ERROR);
        return false;
    }

    std::string name = in_def.substr(0, cpos);

    for (auto i : *manuf_match_vec) {
        auto mi = std::static_pointer_cast<uav_manuf_match>(i);

        if (mi->get_uav_match_name() == name) {
            _MSG_INFO("Invalud 'uav_match=' configuration line, match name '{}' already in use.",
                    name);
            return false;
        }
    }

    std::vector<opt_pair> optvec;
    StringToOpts(in_def.substr(cpos + 1, in_def.length()), ",", &optvec);

    std::string manuf_name = FetchOpt("name", &optvec);
    std::string manuf_model = FetchOpt("model", &optvec);
    std::string macstr = FetchOpt("mac", &optvec);
    std::string ssid = FetchOpt("ssid", &optvec);
    bool matchany = FetchOptBoolean("match_any", &optvec, false);

    if (manuf_name == "") {
        _MSG("Invalid 'uav_match' configuration line, expected 'name=\"...\"' in definition, "
                "but got '" + in_def + "'", MSGFLAG_ERROR);
        return false;
    }

    mac_addr mac;

    if (macstr != "") {
        mac = mac_addr(macstr);

        if (mac.error) {
            _MSG("Invlaid 'uav_match' configuration line, expected 'mac=macaddr' in definition, "
                    "but got an invalid mac in '" + in_def + "'", MSGFLAG_ERROR);
            return false;
        }
    }

    auto manufmatch =
        std::make_shared<uav_manuf_match>();

    try {
        manufmatch->set_uav_match_name(name);
        manufmatch->set_uav_manuf_name(manuf_name);

        if (manuf_model != "")
            manufmatch->set_uav_manuf_model(manuf_model);

        if (macstr != "") 
            manufmatch->set_uav_manuf_mac(mac);

        if (ssid != "")
            manufmatch->set_uav_manuf_ssid_regex(ssid);

        manufmatch->set_uav_manuf_partial(matchany);
    } catch (const std::exception& e) {
        _MSG_ERROR("Invalid 'uav_match=' configuration line: {} in devinition '{}'",
                e.what(), in_def);
        return false;
    }

    manuf_match_vec->push_back(manufmatch);

    return true;
}

