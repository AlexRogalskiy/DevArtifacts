#!/usr/bin/env bash

#'{"deviceId":"xyz","imei":"xyz", "deviceTimestamp":"1","systemTimestamp":"2","lat":"1.0","lng":"2.0","speed":"9.0","accuracy":"5.0"}'

curl -H "Content-Type: application/json" -X POST -d '{"deviceId":"xyz","imei":"xyz", "deviceTimestamp":"1","systemTimestamp":"2","lat":"53.907709999999994","lng":"-3.0385566666666666","speed":"9.0","accuracy":"5.0"}' http://localhost:5554/devicemessage




