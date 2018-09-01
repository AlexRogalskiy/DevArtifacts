#!/bin/sh

##
## shortshell searchbytype
##
## Search through a certain type of file.  I suggest this alias:
##
##     alias searchbytype='$SHORTPATH/bin/searchbytype.sh'
##

if [ -z $1 ]; then
    echo "Usage: searchbytype PATTERN EXTENSION PATH"
else
    find "$3" -name "*.$2" -exec grep "$1" {} \; -print
fi
