#!/bin/bash

##
## shortshell cdiff
##
## A replacement for diff that will colorize the diff output for
## easier reading.  I suggest this alias:
##
##     alias diff='$SHORTPATH/bin/cdiff'
##

RESET=$'\e[0m'
BOLD=$'\e[1m'
CLR1=$'\e[1;33m'

diff $* | sed "s/^<\(.*\)/$CLR1<$RESET$BOLD\1$RESET/g" | sed "s/^>/$CLR1>$RESET/g" | sed "s/^---/$CLR1---$RESET/g" | sed "s/\(^[0-9].*\)/$CLR1\1$RESET/g"
