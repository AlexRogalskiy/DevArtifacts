#!/bin/bash -e
REALPATH="$(readlink -f $0)"
WORKDIR="$(dirname ${REALPATH})"

source "${WORKDIR}/shared.sh" "$1"
supervisorctl unload "${JENKINS_PLIST_PATH}"