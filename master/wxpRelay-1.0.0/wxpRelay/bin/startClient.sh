#!/bin/sh

java "-cp" "../classes:../resources/commons-httpclient-2.0.2.jar:../resources/commons-logging-api.jar:../resources/commons-logging.jar" "wxpRelay/ClientMain" "$1" "$2" "$3" "$4"
