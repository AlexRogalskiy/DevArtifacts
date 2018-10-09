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

#ifndef __DOT11_IE_221_WFA_WPA_H__
#define __DOT11_IE_221_WFA_WPA_H__

/* dot11 ie 221 WFA WPA
 *
 * Alternate WPA definition from the WFA, alternative to the RSN IE
 *
 */

#include <string>
#include <memory>
#include <vector>
#include <kaitai/kaitaistream.h>

class dot11_ie_221_wfa_wpa {
public:
    class wpa_v1_cipher;
    typedef std::vector<std::shared_ptr<wpa_v1_cipher> > shared_wpa_v1_cipher_vector;

    dot11_ie_221_wfa_wpa() { }
    ~dot11_ie_221_wfa_wpa() { }

    static uint32_t ms_wps_oui() {
        return 0x0050f2;
    }

    static uint8_t wfa_wpa_subtype() {
        return 0x01;
    }

    void parse(std::shared_ptr<kaitai::kstream> p_io);

    uint8_t vendor_subtype() {
        return m_vendor_subtype;
    }

    uint16_t wpa_version() {
        return m_wpa_version;
    }

    std::shared_ptr<wpa_v1_cipher> multicast_cipher() {
        return m_multicast_cipher;
    }

    uint16_t unicast_count() {
        return m_unicast_count;
    }

    std::shared_ptr<shared_wpa_v1_cipher_vector> unicast_ciphers() {
        return m_unicast_ciphers;
    }

    uint16_t akm_count() {
        return m_akm_count;
    }

    std::shared_ptr<shared_wpa_v1_cipher_vector> akm_ciphers() {
        return m_akm_ciphers;
    }

protected:
    uint8_t m_vendor_subtype;
    uint16_t m_wpa_version;
    std::shared_ptr<wpa_v1_cipher> m_multicast_cipher;
    uint16_t m_unicast_count;
    std::shared_ptr<shared_wpa_v1_cipher_vector> m_unicast_ciphers;
    uint16_t m_akm_count;
    std::shared_ptr<shared_wpa_v1_cipher_vector> m_akm_ciphers;

public:
    class wpa_v1_cipher {
    public:
        enum wfa_wpa_cipher_e {
            wfa_none = 0,
            wfa_wep_40 = 1,
            wfa_tkip = 2,
            wfa_aes_ocb = 3,
            wfa_aes_ccm = 4,
            wfa_wep_104 = 5,
            wfa_bip = 6,
            wfa_no_group = 7
        };

        enum wfa_wpa_mgmt_e {
            wfa_mgmt_none = 0,
            wfa_mgmt_wpa = 1,
            wfa_mgmt_psk = 2,
            wfa_mgmt_ft_dot1x = 3,
            wfa_mgmt_ft_psk = 4,
            wfa_mgmt_wpa_sha256 = 5,
            wfa_mgmt_psk_sha256 = 6,
            wfa_mgmt_tdls_tpk = 7
        };

        wpa_v1_cipher() {}
        ~wpa_v1_cipher() {}

        void parse(std::shared_ptr<kaitai::kstream> p_io);

        std::string oui() {
            return m_oui;
        }

        uint8_t cipher_type() {
            return m_cipher_type;
        }

    protected:
        std::string m_oui;
        uint8_t m_cipher_type;
    };
};


#endif

