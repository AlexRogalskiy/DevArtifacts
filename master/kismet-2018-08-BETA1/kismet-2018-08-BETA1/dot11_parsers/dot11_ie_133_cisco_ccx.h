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

#ifndef __DOT11_IE_133_CISCO_CCX_H__
#define __DOT11_IE_133_CISCO_CCX_H__

/* dot11 ie 133 Cisco CCX
 *
 * Cisco embeds a human-readable name into beacons under the CCX tag
 *
 */

#include <string>
#include <memory>
#include <vector>
#include <kaitai/kaitaistream.h>

class dot11_ie_133_cisco_ccx {
public:
    dot11_ie_133_cisco_ccx() { }
    ~dot11_ie_133_cisco_ccx() { }

    void parse(std::shared_ptr<kaitai::kstream> p_io);

    std::string ccx_unk1() {
        return m_ccx_unk1;
    }

    std::string ap_name() {
        return m_ap_name;
    }

    uint8_t station_count() {
        return m_station_count;
    }

    std::string ccx_unk2() {
        return m_ccx_unk2;
    }

protected:
    std::string m_ccx_unk1;
    std::string m_ap_name;
    uint8_t m_station_count;
    std::string m_ccx_unk2;
};


#endif

