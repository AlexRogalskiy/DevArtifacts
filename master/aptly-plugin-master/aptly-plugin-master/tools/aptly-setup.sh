#!/bin/sh
# creates 2 repos for testing purpose


rm -rf ~/.aptly/


PREFIX=coolproject-stable
DISTRIBUTION=jessie
COMPONENT=main
REPONAME="$PREFIX"-"$DISTRIBUTION"


aptly repo create -distribution="$DISTRIBUTION" -component="$COMPONENT" "$REPONAME"

aptly publish repo -skip-signing -architectures="amd64,i386" \
                   -component=$COMPONENT -distribution=$DISTRIBUTION  "$REPONAME" $PREFIX


PREFIX=coolproject-testing
DISTRIBUTION=jessie
COMPONENT=main
REPONAME="$PREFIX"-"$DISTRIBUTION"

aptly repo create -distribution="$DISTRIBUTION" -component="$COMPONENT" "$REPONAME"

aptly publish repo -skip-signing -architectures="amd64,i386" \
                   -component=$COMPONENT -distribution=$DISTRIBUTION  "$REPONAME" $PREFIX
