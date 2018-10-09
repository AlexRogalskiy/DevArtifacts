#!/usr/bin/env python2

"""
rtl_433 Kismet data source

Supports both local usb rtlsdr devices via the rtl_433 binary, remote capture
from a usb rtlsdr, and remote capture from a mqtt stream, if paho mqtt is
installed.

Sources are generated as rtl433-XYZ when multiple rtl radios are detected.

Accepts standard options:
    channel=freqMHz   (in mhz)
    channel=freqKHz   (in khz)
    channel=freq      (in raw hz to rtl_433)

    channels="a,b,c"  Pass hopping list to rtl433_bin

Additionally accepts:
    ppm_error         Passed as -p to rtl_433
    gain              Passed as -g to rtl_433

    mqtt              MQTT server
    mqtt_port         MQTT port (default 1883)
    mqtt_channel      MQTT channel (default rtl433)

"""

import argparse
import ctypes
from datetime import datetime
import json
import os
import subprocess
import sys
import threading
import time
import uuid

import KismetExternal

try:
    import paho.mqtt.client as mqtt
    has_mqtt = True
except ImportError:
    has_mqtt = False

class KismetRtl433(object):
    def __init__(self, mqtt = False):
        self.mqtt_mode = mqtt

        self.opts = {}

        self.opts['rtlbin'] = 'rtl_433'
        self.opts['channel'] = "433.920MHz"
        self.opts['frequency'] = None
        self.opts['gain'] = None
        self.opts['device'] = None

        # Thread that runs the RTL popen
        self.rtl_thread = None
        # The popen'd RTL binary
        self.rtl_exec = None

        # Are we killing rtl because we're reconfiguring?
        self.rtl_reconfigure = False

        # We're usually not remote
        self.proberet = None

        # Do we have librtl?
        self.have_librtl = False

        if not self.mqtt_mode:
            self.driverid = "rtl433"
            # Use ctypes to load librtlsdr and probe for supported USB devices
            try:
                self.rtllib = ctypes.CDLL("librtlsdr.so.0")

                self.rtl_get_device_count = self.rtllib.rtlsdr_get_device_count
                self.rtl_get_device_name = self.rtllib.rtlsdr_get_device_name
                self.rtl_get_device_name.argtypes = [ctypes.c_int]
                self.rtl_get_device_name.restype = ctypes.c_char_p
                self.rtl_get_usb_strings = self.rtllib.rtlsdr_get_device_usb_strings
                self.rtl_get_usb_strings.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p]
                self.have_librtl = True
            except OSError:
                self.have_librtl = False
        else:
            self.driverid = "rtl433mqtt"

        parser = argparse.ArgumentParser(description='RTL433 to Kismet bridge - Creates a rtl433 data source on a Kismet server and passes JSON-based records from the rtl_433 binary',
                epilog='Requires the rtl_433 tool (install your distributions package or compile from https://github.com/merbanan/rtl_433)')
        
        parser.add_argument('--in-fd', action="store", type=int, dest="infd")
        parser.add_argument('--out-fd', action="store", type=int, dest="outfd")
        parser.add_argument('--connect', action="store", dest="connect")
        parser.add_argument("--source", action="store", dest="source")
        
        self.config = parser.parse_args()

        if not self.config.connect == None and self.config.source == None:
            print("You must specify a source with --source when connecting to a remote Kismet server")
            sys.exit(0)

        if not self.config.source == None:
            (source, options) = KismetExternal.Datasource.parse_definition(self.config.source)

            if source == None:
                print("Could not parse the --source option; this should be a standard Kismet source definition.")
                sys.exit(0)

            self.proberet = self.datasource_probesource(source, options)

            if self.proberet == None:
                print("Could not configure local source {}, check your source options and config.")
                sys.exit(0)

            if not "success" in self.proberet:
                print("Could not configure local source {}, check your source options and config.")
                if "message" in self.proberet:
                    print(self.proberet["message"])
                sys.exit(0)

            if not self.proberet["success"]:
                print("Could not configure local source {}, check your source options and config.")
                if "message" in self.proberet:
                    print(self.proberet["message"])
                sys.exit(0)

            print("Connecting to remote server {}".format(self.config.connect))

        self.kismet = KismetExternal.Datasource(self.config.infd, self.config.outfd, remote = self.config.connect)

        self.kismet.set_configsource_cb(self.datasource_configure)
        self.kismet.set_listinterfaces_cb(self.datasource_listinterfaces)
        self.kismet.set_opensource_cb(self.datasource_opensource)
        self.kismet.set_probesource_cb(self.datasource_probesource)

        # If we're connecting remote, kick a newsource
        if self.proberet:
            print("Registering remote source {} {}".format(self.driverid, self.config.source))
            self.kismet.send_datasource_newsource(self.config.source, self.driverid, self.proberet['uuid'])

        self.kismet.start()

    def is_running(self):
        return self.kismet.is_running()

    def get_rtl_usb_info(self, index):
        # Allocate memory buffers
        usb_manuf = (ctypes.c_char * 256)()
        usb_product = (ctypes.c_char * 256)()
        usb_serial = (ctypes.c_char * 256)()
       
        # Call the library
        self.rtl_get_usb_strings(index, usb_manuf, usb_product, usb_serial)
       
        # If there's a smarter way to do this, patches welcome
        m = bytearray(usb_manuf)
        p = bytearray(usb_product)
        s = bytearray(usb_serial)

        # Return tuple
        return (m.decode('ascii'), p.decode('ascii'), s.decode('ascii'))

    def check_rtl_bin(self):
        try:
            FNULL = open(os.devnull, 'w')
            r = subprocess.check_call([self.opts['rtlbin'], "--help"], stdout=FNULL, stderr=FNULL)
        except subprocess.CalledProcessError:
            return True
        except OSError:
            return False

        return True

    def __rtl_thread(self):
        """ Internal thread for running the rtl binary """
        cmd = [ self.opts['rtlbin'], '-F', 'json' ]

        if not self.opts['device'] is None:
            cmd.append('-d')
            cmd.append("{}".format(self.opts['device']))

        if not self.opts['gain'] is None:
            cmd.append('-g')
            cmd.append("{}".format(self.opts['gain']))

        if not self.opts['frequency'] is None:
            cmd.append('-f')
            cmd.append("{}".format(self.opts['frequency']))

        seen_any_valid = False
        failed_once = False

        try:
            FNULL = open(os.devnull, 'w')
            self.rtl_exec = subprocess.Popen(cmd, stderr=FNULL, stdout=subprocess.PIPE)

            while True:
                l = self.rtl_exec.stdout.readline()

                if not self.handle_json(l):
                    raise RuntimeError('could not process response from rtl_433')

                seen_any_valid = True


        except Exception as e:
            # Catch all errors, but don't die if we're reconfiguring rtl; then we need
            # to relaunch the binary
            if not self.rtl_reconfigure:
                self.kismet.send_datasource_error_report(message = "Unable to process output from rtl_433: {}".format(e))
        finally:
            if not seen_any_valid and not self.rtl_reconfigure:
                self.kismet.send_datasource_error_report(message = "An error occurred in rtl_433 and no valid devices were seen; is your USB device plugged in?  Try running rtl_433 in a terminal and confirm that it can connect to your device.")
                self.kismet.spindown()

            self.rtl_exec.kill()


    def run_rtl433(self):
        if self.rtl_thread != None:
            # Turn on reconfigure mode
            if self.rtl_exec != None:
                self.rtl_reconfigure = True
                self.rtl_exec.kill(9)

            # Let the thread spin down and turn off reconfigure mode
            self.rtl_thread.join()
            self.rtl_reconfigure = False

        self.rtl_thread = threading.Thread(target=self.__rtl_thread)
        self.rtl_thread.daemon = True
        self.rtl_thread.start()

    def __mqtt_thread(self):
        self.mq.loop_forever()

    def run_mqtt(self, options):
        def on_msg(client, user, msg):
            if not self.handle_json(msg.payload):
                raise RuntimeError('could not post data')

        opts = options
        opts.setdefault("mqtt", 'localhost')
        opts.setdefault("mqtt_port", '1883')
        opts.setdefault("mqtt_channel", 'rtl433')

        self.mq = mqtt.Client()
        self.mq.on_message = on_msg
        self.mq.connect(opts['mqtt'], int(opts['mqtt_port']))
        self.mq.subscribe(opts['mqtt_channel'])

        self.mq_thread = threading.Thread(target=self.__mqtt_thread)
        self.mq_thread.daemon = True
        self.mq_thread.start()


    # Implement the listinterfaces callback for the datasource api;
    def datasource_listinterfaces(self, seqno):
        interfaces = []

        if self.rtllib != None:
            for i in range(0, self.rtl_get_device_count()):
                intf = KismetExternal.datasource_pb2.SubInterface()
                intf.interface = "rtl433-{}".format(i)
                intf.flags = ""
                intf.hardware = self.rtl_get_device_name(i)
                interfaces.append(intf)

        self.kismet.send_datasource_interfaces_report(seqno, interfaces)

    def __get_mqtt_uuid(self, options):
        opts = options
        opts.setdefault('mqtt', 'localhost')
        opts.setdefault('mqtt_port', '1883')
        opts.setdefault('mqtt_channel', 'kismet')

        mqhash = KismetExternal.Datasource.adler32("{}{}{}".format(opts['mqtt'], opts['mqtt_port'], opts['mqtt_channel']))
        mqhex = "0000{:02X}".format(mqhash)

        return KismetExternal.Datasource.make_uuid("kismet_cap_sdr_rtl433", mqhex)

    def __get_rtlsdr_uuid(self, intnum):
        # Get the USB info
        (manuf, product, serial) = self.get_rtl_usb_info(intnum)

        # Hash the slot, manuf, product, and serial, to get a unique ID for the UUID
        devicehash = KismetExternal.Datasource.adler32("{}{}{}{}".format(intnum, manuf, product, serial))
        devicehex = "0000{:02X}".format(devicehash)

        return KismetExternal.Datasource.make_uuid("kismet_cap_sdr_rtl433", devicehex)

    # Implement the probesource callback for the datasource api
    def datasource_probesource(self, source, options):
        ret = {}

        # Does the source look like 'rtl433-XYZ'?
        if not source[:7] == "rtl433-":
            return None

        if source[7:] == "mqtt":
            if not 'mqtt' in options:
                return None
            if not has_mqtt:
                return None

            ret['hardware'] = "MQTT"
            ret['uuid'] = self.__get_mqtt_uuid(options)
        else:
            # Do we have librtl?
            if not self.have_librtl:
                return None

            if self.mqtt_mode:
                return None

            try:
                intnum = int(source[7:])
            except ValueError:
                return None

            if intnum >= self.rtl_get_device_count():
                return None

            ret['hardware'] = self.rtl_get_device_name(intnum)
            ret['uuid'] = self.__get_rtlsdr_uuid(intnum)

        ret['channel'] = self.opts['channel']
        ret['channels'] = [self.opts['channel']]
        ret['success'] = True
        return ret

    def datasource_opensource(self, source, options):
        ret = {}

        # Does the source look like 'rtl433-XYZ'?
        if not source[:7] == "rtl433-":
            ret["success"] = False
            ret["message"] = "Could not parse which rtlsdr device to use"
            return ret

        intnum = -1

        if source[7:] == "mqtt":
            if not 'mqtt' in options:
                ret["success"] = False
                ret["message"] = "MQTT requested, but no mqtt=xyz option in source definition"
                return ret
            if not has_mqtt:
                ret["success"] = False
                ret["message"] = "MQTT requested, but the python paho mqtt package is not installed"
                return ret
            
            ret['hardware'] = "MQTT"
            ret['uuid'] = self.__get_mqtt_uuid(options)

            self.mqtt_mode = True
        else:
            if not self.have_librtl:
                ret["success"] = False
                ret["message"] = "could not find librtlsdr, unable to configure rtlsdr interfaces"
                return ret

            try:
                intnum = int(source[7:])
            except ValueError:
                ret["success"] = False
                ret["message"] = "Could not parse rtl device"
                return ret

            if intnum >= self.rtl_get_device_count():
                ret["success"] = False
                ret["message"] = "Could not find rtl-sdr device {}".format(intnum)
                return ret

            ret['hardware'] = self.rtl_get_device_name(intnum)
            ret['uuid'] = self.__get_rtlsdr_uuid(intnum)

            self.opts['device'] = intnum

            self.mqtt_mode = False

        if not self.mqtt_mode:
            if not self.check_rtl_bin():
               ret['success'] = False
               ret['message'] = "Could not find rtl_433 binary; make sure you've installed rtl_433, check the Kismet README for more information."
               return

        ret['success'] = True

        if self.mqtt_mode:
            self.run_mqtt(options)
        else:
            self.run_rtl433()

        return ret

    def datasource_configure(self, seqno, config):
        #print(config)

        return {"success": True}

    def handle_json(self, injson):
        try:
            j = json.loads(injson)
            r = json.dumps(j)

            report = KismetExternal.datasource_pb2.SubJson()

            dt = datetime.now()
            report.time_sec = int(time.mktime(dt.timetuple()))
            report.time_usec = int(dt.microsecond)

            report.type = "RTL433"
            report.json = r

            # print("python sending json report", r);

            self.kismet.send_datasource_data_report(full_json=report)
        except ValueError as e:
            print(e)
            self.kismet.send_datasource_error_report(message = "Could not parse JSON output of rtl_433")
            return False
        except Exception as e:
            print(e)
            self.kismet.send_datasource_error_report(message = "Could not process output of rtl_433")
            return False

        return True


