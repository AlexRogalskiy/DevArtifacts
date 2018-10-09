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

#ifndef __PHY_UAV_DRONE_H__
#define __PHY_UAV_DRONE_H__

#include "trackedelement.h"
#include "tracked_location.h"
#include "phyhandler.h"
#include "packetchain.h"

#include "dot11_parsers/dot11_ie_221_dji_droneid.h"

#ifdef HAVE_LIBPCRE
#include <pcre.h>
#endif

/* An abstract model of a UAV (drone/quadcopter/plane) device.
 *
 * A UAV may have multiple communications protocols (bluetooth, wi-fi, RF)
 * which comprise the same device; references to the independent devices of
 * other phys are linked in the optional descriptors.
 *
 * A UAV is worthy of its own top-level device because it also introduces
 * independent tracking requirements; location history may be sources
 * from UAV telemetry independent of the devices/kismet sensor locations.
 *
 */

class uav_tracked_telemetry : public tracker_component {
public:
    uav_tracked_telemetry() :
        tracker_component() {
        register_fields();
        reserve_fields(NULL);
    }

    uav_tracked_telemetry(int in_id) :
        tracker_component(in_id) {
        register_fields();
        reserve_fields(NULL);
    }

    uav_tracked_telemetry(int in_id, std::shared_ptr<TrackerElementMap> e) :
        tracker_component(in_id) {
        register_fields();
        reserve_fields(e);
    }

    virtual uint32_t get_signature() const override {
        return Adler32Checksum("uav_tracked_telemetry");
    }

    virtual ~uav_tracked_telemetry() { }

    virtual std::unique_ptr<TrackerElement> clone_type() override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    virtual std::unique_ptr<TrackerElement> clone_type(int in_id) override {
        using this_t = std::remove_pointer<decltype(this)>::type;
        auto dup = std::unique_ptr<this_t>(new this_t());
        return std::move(dup);
    }

    __ProxyTrackable(location, kis_tracked_location_triplet, location);
    __Proxy(telem_timestamp, double, double, double, telem_ts);
    __Proxy(yaw, double, double, double, yaw);
    __Proxy(pitch, double, double, double, pitch);
    __Proxy(roll, double, double, double, roll);
    __Proxy(height, double, double, double, height);
    __Proxy(v_north, double, double, double, v_north);
    __Proxy(v_east, double, double, double, v_east);
    __Proxy(v_up, double, double, double, v_up);

    __Proxy(motor_on, uint8_t, bool, bool, motor_on);
    __Proxy(airborne, uint8_t, bool, bool, airborne);

    void from_droneid_flight_reg(std::shared_ptr<dot11_ie_221_dji_droneid::dji_subcommand_flight_reg> flight_reg) {
        if (flight_reg->state_gps_valid()) {
            location->set(flight_reg->lat(), flight_reg->lon());
            
            if (flight_reg->state_alt_valid()) {
                location->set_alt(flight_reg->altitude());
                location->set_fix(3);
            } else {
                location->set_fix(2);
            }

            location->set_valid(true);
        }

        set_yaw(flight_reg->yaw());
        set_pitch(flight_reg->pitch());
        set_roll(flight_reg->roll());

        if (flight_reg->state_horiz_valid()) {
            set_v_east(flight_reg->v_east());
            set_v_north(flight_reg->v_north());
        }

        if (flight_reg->state_vup_valid()) 
            set_v_up(flight_reg->v_up());

        if (flight_reg->state_height_valid())
            set_height(flight_reg->height());

        set_motor_on(flight_reg->state_motor_on());
        set_airborne(flight_reg->state_in_air());
    }

protected:
    virtual void register_fields() override {
        tracker_component::register_fields();

        RegisterField("uav.telemetry.location", "UAV GPS location", &location);
        RegisterField("uav.telemetry.timestamp", "timetamp (sec.usec)", &telem_ts);
        RegisterField("uav.telemetry.yaw", "yaw", &yaw);
        RegisterField("uav.telemetry.pitch", "pitch", &pitch);
        RegisterField("uav.telemetry.roll", "roll", &roll);
        RegisterField("uav.telemetry.height", "height above ground", &height);
        RegisterField("uav.telemetry.v_north", "velocity relative to n/s", &v_north);
        RegisterField("uav.telemetry.v_east", "velocity relative to e/w", &v_east);
        RegisterField("uav.telemetry.v_up", "velocity relative to up/down", &v_up);

        RegisterField("uav.telemetry.motor_on", "device reports motor enabled", &motor_on);
        RegisterField("uav.telemetry.airborne", "device reports UAV is airborne", &airborne);
    }

    std::shared_ptr<kis_tracked_location_triplet> location;
    std::shared_ptr<TrackerElementDouble> telem_ts;
    std::shared_ptr<TrackerElementDouble> yaw;
    std::shared_ptr<TrackerElementDouble> pitch;
    std::shared_ptr<TrackerElementDouble> roll;
    std::shared_ptr<TrackerElementDouble> height;
    std::shared_ptr<TrackerElementDouble> v_north;
    std::shared_ptr<TrackerElementDouble> v_east;
    std::shared_ptr<TrackerElementDouble> v_up;

    std::shared_ptr<TrackerElementUInt8> motor_on;
    std::shared_ptr<TrackerElementUInt8> airborne;
};

// Match a manufacturer (such as OUI, SSID, or both)
class uav_manuf_match : public tracker_component {
public:
    uav_manuf_match() :
        tracker_component() {

#ifdef HAVE_LIBPCRE
        re = NULL;
        study = NULL;
#endif

        register_fields();
        reserve_fields(NULL);
    }

    uav_manuf_match(int in_id) :
        tracker_component(in_id) {

#ifdef HAVE_LIBPCRE
        re = NULL;
        study = NULL;
#endif

        register_fields();
        reserve_fields(NULL);
    }

    uav_manuf_match(int in_id, std::shared_ptr<TrackerElementMap> e) :
        tracker_component(in_id) {

#ifdef HAVE_LIBPCRE
        re = NULL;
        study = NULL;
#endif

        register_fields();
        reserve_fields(e);
    }

    virtual ~uav_manuf_match() { 
#ifdef HAVE_LIBPCRE
        if (re != NULL)
            pcre_free(re);

        if (study != NULL)
            pcre_free(study);
#endif
    }

    virtual uint32_t get_signature() const override {
        return Adler32Checksum("uav_match");
    }

    __Proxy(uav_match_name, std::string, std::string, std::string, uav_match_name);

    __Proxy(uav_manuf_name, std::string, std::string, std::string, uav_manuf_name);
    __Proxy(uav_manuf_model, std::string, std::string, std::string, uav_manuf_model);
    __Proxy(uav_manuf_mac, mac_addr, mac_addr, mac_addr, uav_manuf_mac);

    void set_uav_manuf_ssid_regex(const std::string&);
    __ProxyGet(uav_manuf_ssid_regex, std::string, std::string, uav_manuf_ssid_regex);

    __Proxy(uav_manuf_partial, uint8_t, bool, bool, uav_manuf_partial);

    bool match_record(const mac_addr& in_mac, const std::string& in_ssid);

protected:
    virtual void register_fields() override {
        tracker_component::register_fields();

        RegisterField("uav_match_name", "Match name", &uav_match_name);
        RegisterField("uav.manufmatch.name", "Matched manufacturer name", &uav_manuf_name);
        RegisterField("uav.manufmatch.model", "Matched model name", &uav_manuf_model);

        RegisterField("uav.manufmatch.mac", "Matching mac address fragment", &uav_manuf_mac);
        RegisterField("uav.manufmatch.ssid_regex", "Matching SSID regex", &uav_manuf_ssid_regex);

        RegisterField("uav.manufmatch.partial", 
                "Allow partial matches (only manuf or only ssid)", &uav_manuf_partial);
    }

    std::shared_ptr<TrackerElementString> uav_match_name;
    std::shared_ptr<TrackerElementString> uav_manuf_name;
    std::shared_ptr<TrackerElementString> uav_manuf_model;
    std::shared_ptr<TrackerElementMacAddr> uav_manuf_mac;
    std::shared_ptr<TrackerElementString> uav_manuf_ssid_regex;
    std::shared_ptr<TrackerElementUInt8> uav_manuf_partial;

#ifdef HAVE_LIBPCRE
    pcre *re;
    pcre_extra *study;
#endif
};

/* A 'light' phy which attaches additional records to existing phys */
class uav_tracked_device : public tracker_component {
public:
    uav_tracked_device() :
        tracker_component() {
        register_fields();
        reserve_fields(NULL);
    }

    uav_tracked_device(int in_id) :
        tracker_component(in_id) {

        register_fields();
        reserve_fields(NULL);
    }

    uav_tracked_device(int in_id, std::shared_ptr<TrackerElementMap> e) :
        tracker_component(in_id) {

        register_fields();
        reserve_fields(e);
    }

    virtual ~uav_tracked_device() { }

    virtual uint32_t get_signature() const override {
        return Adler32Checksum("uav_tracked_device");
    }

    __Proxy(uav_manufacturer, std::string, std::string, std::string, uav_manufacturer);
    __Proxy(uav_model, std::string, std::string, std::string, uav_model);
    __Proxy(uav_serialnumber, std::string, std::string, std::string, uav_serialnumber);
    
    __ProxyDynamicTrackable(last_telem_loc, uav_tracked_telemetry, last_telem_loc, last_telem_loc_id);

    std::shared_ptr<uav_tracked_telemetry> new_telemetry() {
        return std::make_shared<uav_tracked_telemetry>(telem_history_entry_id);
    }

    __ProxyTrackable(uav_telem_history, TrackerElementVector, uav_telem_history);

    __Proxy(uav_match_type, std::string, std::string, std::string, uav_match_type);

    __ProxyDynamicTrackable(home_location, kis_tracked_location_triplet, 
            home_location, home_location_id);
    __ProxyDynamicTrackable(matched_type, uav_manuf_match, matched_type, matched_type_id);

protected:
    virtual void register_fields() override {
        tracker_component::register_fields();

        RegisterField("uav.manufacturer", "Manufacturer", &uav_manufacturer);
        RegisterField("uav.model", "Model", &uav_model);
        RegisterField("uav.serialnumber", "Serial number", &uav_serialnumber);

        last_telem_loc_id =
            RegisterField("uav.last_telemetry", "Last drone telemetry location", &last_telem_loc);

        RegisterField("uav.telemetry_history", "Previous telemetry location data", &uav_telem_history);

        telem_history_entry_id =
            RegisterField("uav.telemetry_entry",
                    TrackerElementFactory<uav_tracked_telemetry>(),
                    "historical telemetry");

        RegisterField("uav.match_type", "Match type (drone characteristics)", &uav_match_type);

        home_location_id =
            RegisterField("uav.telemetry.home_location", "UAV takeoff/home location",
                    &home_location);

        matched_type_id =
            RegisterField("uav.type", "Matched device", &matched_type);
    }

    virtual void reserve_fields(std::shared_ptr<TrackerElementMap> e) override {
        tracker_component::reserve_fields(e);

        if (e != NULL) {
            for (auto l = uav_telem_history->begin(); l != uav_telem_history->end(); ++l) {
                auto telem =
                    std::make_shared<uav_tracked_telemetry>(telem_history_entry_id,
                            std::static_pointer_cast<TrackerElementMap>(*l));
                *l = telem;
            }
        }
    }

    std::shared_ptr<TrackerElementString> uav_manufacturer;
    std::shared_ptr<TrackerElementString> uav_model;
    std::shared_ptr<TrackerElementString> uav_serialnumber;

    std::shared_ptr<uav_tracked_telemetry> last_telem_loc;
    int last_telem_loc_id;

    std::shared_ptr<TrackerElementVector> uav_telem_history;

    int telem_history_entry_id;

    std::shared_ptr<TrackerElementString> uav_match_type;

    std::shared_ptr<kis_tracked_location_triplet> home_location;
    int home_location_id;

    std::shared_ptr<uav_manuf_match> matched_type;
    int matched_type_id;
};

/* Frankenphy which absorbs other phys */
class Kis_UAV_Phy : public Kis_Phy_Handler, public Kis_Net_Httpd_CPPStream_Handler {
public:
    virtual ~Kis_UAV_Phy();

    Kis_UAV_Phy(GlobalRegistry *in_globalreg) :
        Kis_Phy_Handler(in_globalreg) { }

    virtual Kis_Phy_Handler *CreatePhyHandler(GlobalRegistry *in_globalreg,
            Devicetracker *in_tracker, int in_phyid) {
        return new Kis_UAV_Phy(in_globalreg, in_tracker, in_phyid);
    }

    Kis_UAV_Phy(GlobalRegistry *in_globalreg, Devicetracker *in_tracker,
            int in_phyid);

    // Common classifier to make new UAV records
    static int CommonClassifier(CHAINCALL_PARMS);

    // Restore stored UAV records
    virtual void LoadPhyStorage(SharedTrackerElement in_storage,
            SharedTrackerElement in_device);

    // HTTPD API
    virtual bool Httpd_VerifyPath(const char *path, const char *method);

    virtual void Httpd_CreateStreamResponse(Kis_Net_Httpd *httpd,
            Kis_Net_Httpd_Connection *connection,
            const char *url, const char *method, const char *upload_data,
            size_t *upload_data_size, std::stringstream &stream);

    virtual int Httpd_PostComplete(Kis_Net_Httpd_Connection *concls);

protected:
    bool parse_manuf_definition(std::string def);

    kis_recursive_timed_mutex uav_mutex;

    std::shared_ptr<Packetchain> packetchain;

    /* We need to look at the dot11 packet to see if we've got a droneid ie tag */
    int pack_comp_common, pack_comp_80211, pack_comp_device;

    int uav_device_id;

    std::shared_ptr<TrackerElementVector> manuf_match_vec;
};

#endif

