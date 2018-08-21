#!/bin/bash -e

# might not work on some MingW versions, ignoring error in such case
set +e
REALPATH="$(readlink -f $0)"
set -e
if [ -z "$REALPATH" ]; then
    REALPATH="$0"
fi

WORKDIR="$(dirname ${REALPATH})"
ROOTDIR="$(dirname ${WORKDIR})"
JENKINS_CONFIG_FILE="${ROOTDIR}/.jenkins"
if [ ! -f "${JENKINS_CONFIG_FILE}" ]; then
    echo "Configuration file not found at ${JENKINS_CONFIG_FILE}"
    exit 1
fi
source "${JENKINS_CONFIG_FILE}"

if [ -z "${JENKINS_PLUGINS_PATH}" ]; then
    echo "JENKINS_PLUGINS_PATH viariable is empty"
    echo "Make sure you set it with Jenkins' plugins directory path"
    exit 1
fi

if [ ! -d "${JENKINS_PLUGINS_PATH}" ]; then
    echo "${JENKINS_PLUGINS_PATH} cannot be accessed or it's not a directory"
    exit 1
fi

OSNAME="$(uname)"
OSNAME_SHORT="$(uname -s)"

if [ "$OSNAME" == "Darwin" ]; then
    OS_DIR="MacOS"
elif [ "$(expr substr ${OSNAME_SHORT} 1 5)" == "Linux" ]; then
    OS_DIR="Unix"
elif [ "$(expr substr ${OSNAME_SHORT} 1 5)" == "MINGW" ]; then
    OS_DIR="Windows"
else
    echo "Unknown OS: ${OSNAME}"
    exit 1
fi

"${ROOTDIR}/gradlew" clean jpi
cp "${ROOTDIR}/result/bin/restricted-register.jpi" "${JENKINS_PLUGINS_PATH}/"

"${WORKDIR}/${OS_DIR}/jenkins-stop.sh" "${JENKINS_CONFIG_FILE}"
"${WORKDIR}/${OS_DIR}/jenkins-start.sh" "${JENKINS_CONFIG_FILE}"
