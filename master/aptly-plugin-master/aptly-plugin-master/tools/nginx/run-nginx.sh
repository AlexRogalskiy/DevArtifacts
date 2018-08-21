#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "LISTENING PORTS: 8081 (http) and 8083"

trap 'kill $(jobs -p)' EXIT

aptly api serve &
nginx -p "$SCRIPT_DIR" -c nginx.conf 


