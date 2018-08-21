#!/bin/bash -e
# first param is path to jenkins configuration file (/.jenkins)
source "$1"

if [ -z "${JENKINS_PLIST_PATH}" ]; then
    echo "JENKINS_PLIST_PATH is missing from configuration or it is empty."
    exit 1
fi

if [ ! -f "${JENKINS_PLIST_PATH}" ]; then
    echo "${JENKINS_PLIST_PATH} cannot be accessed or it's not a file"
    exit 1
fi

