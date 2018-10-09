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

#ifndef __DOT11_IE_192_VHT_OP_H__
#define __DOT11_IE_192_VHT_OP_H__

/* dot11 ie 192 VHT Operation
 *
 * 802.11AC VHT operational speeds
 *
 */

#include <string>
#include <memory>
#include <vector>
#include <kaitai/kaitaistream.h>

class dot11_ie_192_vht_op {
public:
    dot11_ie_192_vht_op() { }
    ~dot11_ie_192_vht_op() { }

    enum ch_channel_width {
        ch_20_40 = 0,
        ch_80 = 1,
        ch_160 = 2,
        ch_80_80 = 3
    };

    void parse(std::shared_ptr<kaitai::kstream> p_io);

    ch_channel_width channel_width() {
        return (ch_channel_width) m_channel_width;
    }

    uint8_t center1() {
        return m_center1;
    }

    uint8_t center2() {
        return m_center2;
    }

    uint16_t basic_mcs_map() {
        return m_basic_mcs_map;
    }

    unsigned int basic_mcs_1() {
        return basic_mcs_map() & 0x3;
    }

    unsigned int basic_mcs_2() {
        return basic_mcs_map() & 0xC;
    }

    unsigned int basic_mcs_3() {
        return basic_mcs_map() & 0x30;
    }

    unsigned int basic_mcs_4() {
        return basic_mcs_map() & 0xC0;
    }

    unsigned int basic_mcs_5() {
        return basic_mcs_map() & 0x300;
    }

    unsigned int basic_mcs_6() {
        return basic_mcs_map() & 0xC00;
    }

    unsigned int basic_mcs_7() {
        return basic_mcs_map() & 0x3000;
    }

protected:
    uint8_t m_channel_width;
    uint8_t m_center1;
    uint8_t m_center2;
    uint16_t m_basic_mcs_map;

};


#endif

