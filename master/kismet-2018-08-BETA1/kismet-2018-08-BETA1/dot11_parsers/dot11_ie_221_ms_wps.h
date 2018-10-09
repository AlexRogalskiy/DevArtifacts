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

#ifndef __DOT11_IE_221_MS_WPS_H__
#define __DOT11_IE_221_MS_WPS_H__

/* dot11 ie 221 vendor WPS
 *
 * 802.11 WPS control
 *
 */

#include <string>
#include <memory>
#include <vector>
#include <kaitai/kaitaistream.h>

class dot11_ie_221_ms_wps {
public:
    class wps_de_sub_element;

    typedef std::vector<std::shared_ptr<wps_de_sub_element> > shared_wps_de_sub_element_vector;

    dot11_ie_221_ms_wps() { }
    ~dot11_ie_221_ms_wps() { }

    void parse(std::shared_ptr<kaitai::kstream> p_io);

    uint8_t vendor_subtype() {
        return m_vendor_subtype;
    }

    std::shared_ptr<shared_wps_de_sub_element_vector> wps_elements() {
        return m_wps_elements;
    }

    static uint32_t ms_wps_oui() {
        return 0x0050f2;
    }

    static uint8_t ms_wps_subtype() {
        return 0x04;
    }

protected:
    uint8_t m_vendor_subtype;
    std::shared_ptr<shared_wps_de_sub_element_vector> m_wps_elements;

public:
    class wps_de_sub_element {
    public:
        class wps_de_sub_common;
        class wps_de_sub_string;
        class wps_de_sub_rfband;
        class wps_de_sub_state;
        class wps_de_sub_uuid_e;
        class wps_de_sub_vendor_extension;
        class wps_de_sub_version;
        class wps_de_sub_primary_type;
        class wps_de_sub_ap_setup;
        class wps_de_sub_generic;

        enum wps_de_type_e {
            wps_de_device_name = 0x1011,
            wps_de_manuf = 0x1021,
            wps_de_model = 0x1023,
            wps_de_model_num = 0x1024,
            wps_de_rfbands = 0x103c,
            wps_de_serial = 0x1042,
            wps_de_state = 0x1044,
            wps_de_uuid_e = 0x1047,
            wps_de_vendor_extension = 0x1049,
            wps_de_version = 0x104a,
            wps_de_primary_type = 0x1054,
            wps_de_ap_setup = 0x1057
        };


        wps_de_sub_element() {};
        ~wps_de_sub_element() {};

        void parse(std::shared_ptr<kaitai::kstream> p_io);

        wps_de_type_e wps_de_type() {
            return (wps_de_type_e) m_wps_de_type;
        }

        uint16_t wps_de_len() {
            return m_wps_de_len;
        }

        std::string wps_de_content() {
            return m_wps_de_content;
        }

        std::shared_ptr<kaitai::kstream> wps_de_content_data_stream() {
            return m_wps_de_content_data_stream;
        }

        std::shared_ptr<wps_de_sub_common> sub_element() {
            return m_sub_element;
        }

        std::shared_ptr<wps_de_sub_string> sub_element_as_string() {
            return std::static_pointer_cast<wps_de_sub_string>(sub_element());
        }

        std::shared_ptr<wps_de_sub_string> sub_element_name() {
            if (wps_de_type() == wps_de_device_name)
                return sub_element_as_string();
            return NULL;
        }

        std::shared_ptr<wps_de_sub_string> sub_element_manuf() {
            if (wps_de_type() == wps_de_manuf)
                return sub_element_as_string();
            return NULL;
        }

        std::shared_ptr<wps_de_sub_string> sub_element_model() {
            if (wps_de_type() == wps_de_model)
                return sub_element_as_string();
            return NULL;
        }

        std::shared_ptr<wps_de_sub_string> sub_element_model_num() {
            if (wps_de_type() == wps_de_model_num)
                return sub_element_as_string();
            return NULL;
        }

        std::shared_ptr<wps_de_sub_rfband> sub_element_rfbands() {
            if (wps_de_type() == wps_de_rfbands)
                return std::static_pointer_cast<wps_de_sub_rfband>(sub_element());
            return NULL;
        }

        std::shared_ptr<wps_de_sub_string> sub_element_serial() {
            if (wps_de_type() == wps_de_serial)
                return sub_element_as_string();
            return NULL;
        }

        std::shared_ptr<wps_de_sub_state> sub_element_state() {
            if (wps_de_type() == wps_de_state)
                return std::static_pointer_cast<wps_de_sub_state>(sub_element());
            return NULL;
        }

    protected:
        uint16_t m_wps_de_type;
        uint16_t m_wps_de_len;
        std::string m_wps_de_content;
        std::shared_ptr<kaitai::kstream> m_wps_de_content_data_stream;
        std::shared_ptr<wps_de_sub_common> m_sub_element;

    public:
        class wps_de_sub_common {
        public:
            wps_de_sub_common() { };
            virtual ~wps_de_sub_common() { };

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io) { }
        };

        class wps_de_sub_string : public wps_de_sub_common {
        public:
            wps_de_sub_string() { }
            virtual ~wps_de_sub_string() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            std::string str() {
                return m_str;
            }

        protected:
            std::string m_str;
        };

        class wps_de_sub_rfband : public wps_de_sub_common {
        public:
            wps_de_sub_rfband() { }
            virtual ~wps_de_sub_rfband() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            uint8_t rfband() {
                return m_rfband;
            }

            unsigned int rfband_2p4ghz() {
                return rfband() & 0x1;
            }

            unsigned int rfband_5ghz() {
                return rfband() & 0x2;
            }

        protected:
            uint8_t m_rfband;
        };

        class wps_de_sub_state : public wps_de_sub_common {
        public:
            wps_de_sub_state() { }
            virtual ~wps_de_sub_state() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            uint8_t state() {
                return m_state;
            }

            unsigned int wps_state_configured() {
                return state() & 0x2;
            }

        protected:
            uint8_t m_state;
        };

        class wps_de_sub_uuid_e : public wps_de_sub_common {
        public:
            wps_de_sub_uuid_e() { }
            virtual ~wps_de_sub_uuid_e() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            std::string uuid() {
                return m_uuid;
            }

        protected:
            std::string m_uuid;
        };

        class wps_de_sub_primary_type : public wps_de_sub_common {
        public:
            wps_de_sub_primary_type() { }
            virtual ~wps_de_sub_primary_type() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            uint16_t category() {
                return m_category;
            }

            uint32_t typedata() {
                return m_typedata;
            }

            uint16_t subcategory() {
                return m_subcategory;
            }

        protected:
            uint16_t m_category;
            uint32_t m_typedata;
            uint16_t m_subcategory;
        };

        class wps_de_sub_vendor_extension : public wps_de_sub_common {
        public:
            wps_de_sub_vendor_extension() { }
            virtual ~wps_de_sub_vendor_extension() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            std::string vendor_id() {
                return m_vendor_id;
            }

            uint8_t wfa_sub_id() {
                return m_wfa_sub_id;
            }

            uint8_t wfa_sub_len() {
                return m_wfa_sub_len;
            }

            std::string wfa_sub_data() {
                return m_wfa_sub_data;
            }

        protected:
            std::string m_vendor_id;
            uint8_t m_wfa_sub_id;
            uint8_t m_wfa_sub_len;
            std::string m_wfa_sub_data;
        };

        class wps_de_sub_version : public wps_de_sub_common {
        public:
            wps_de_sub_version() { }
            virtual ~wps_de_sub_version() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            uint8_t version() {
                return m_version;
            }

        protected:
            uint8_t m_version;
        };

        class wps_de_sub_ap_setup : public wps_de_sub_common {
        public:
            wps_de_sub_ap_setup() { }
            virtual ~wps_de_sub_ap_setup() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            uint8_t ap_setup_locked() {
                return m_ap_setup_locked;
            }

        protected:
            uint8_t m_ap_setup_locked;
        };

        class wps_de_sub_generic : public wps_de_sub_common {
        public:
            wps_de_sub_generic() { }
            virtual ~wps_de_sub_generic() { }

            virtual void parse(std::shared_ptr<kaitai::kstream> p_io);

            std::string wps_de_data() {
                return m_wps_de_data;
            }

        protected:
            std::string m_wps_de_data;
        };

    };

};


#endif

