#!/usr/bin/env bash
#
#{
#   "account":{
#      "name":"testaccount"
#   },
#   "user":{
#      "email":"test@test.com",
#      "passwordHash":"password"
#   }
#}
#'{"account":{"name":"testaccount"},"user":{"email":"test@test.com","passwordHash":"password"}}'


curl -H "Content-Type: application/json" -X POST -d '{"account":{"name":"testaccount"},"user":{"email":"test@test.com","passwordHash":"password"}}' http://localhost:7001/account




