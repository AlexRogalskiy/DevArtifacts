#!/usr/bin/env bash

#{
#   "account":{
#      "name":"testaccount"
#   },
#   "device":{
#      "imei":"xyz"
#   }
#}

#'{"account":{"name":"testaccount"},"device":{"imei":"xyz"}}'


curl -H "Content-Type: application/json" -X POST -d '{"account":{"name":"testaccount"},"device":{"imei":"868590027340513"}}' http://localhost:7001/device

curl -H "Content-Type: application/json" -X POST -d '{"account":{"name":"testaccount"},"device":{"imei":"000000000000001"}}' http://localhost:7001/device




