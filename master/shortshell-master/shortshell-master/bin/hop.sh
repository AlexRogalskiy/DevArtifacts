#!/bin/bash

##
## hop - part of shortshell
## Zachary Johnson
## http://www.zachstronaut.com
##
## Hop to domains' web directories, between test and production directories,
## and other places. It's like cd but with name target destinations.
##
## Basic Usage:
##
##     hop foo      -   cd to the path for target named foo
##     hop home     -   same as cd ~
##     hop back     -   hop back to the last place you hopped
##
## Must be sourced into your local shell using the period operator so I
## suggest the following alias:
##
##     alias hop='. /var/www/html/bin/hop'
##
## Other previous clever alias possibilities before I discovered
## that I could use source / the period operator:
##
##     alias hop='PWD=`pwd`; cd `/home/john4338/html/bin/hop.php $PWD`'
##     alias hop='cd $(/var/www/html/bin/hop.php $(pwd))'
##
## You may want to set the SHORTWEBROOTS variable for your shell so hop can
## automagically find targets in those paths:
##
##     export SHORTWEBROOTS="/var/www/html/|/home/$USER/www/"
##
## Custom hop cases can be placed in ~/.hop.sh
##
##     Example:
##
##     #!/bin/bash
##
##     case $1 in 
##         nav | nav/)         NEWPWD=includes/nav
##                             ;;
##         html | html/)       NEWPWD=/var/www/html
##                             ;;
##     esac
##
## Additional examples:
##
##     If you have a folder /var/www/html/ with subfolders foo/ and bar/ for
##     foo.com and bar.com, and your SHORTWEBROOTS="/var/www/html/" then if
##     you were to hop foo your current working directory will be changed to
##     /var/www/html/foo/ just as if you had done cd /var/www/html/foo
##
## Environment variable dependencies:
##
##     DARWIN, LINUX, SHORTWEBROOTS
##

# OS dependent flags
if [ -n "$(echo $OSTYPE | grep $DARWIN)" ]; then
    SEDFLAG='-E'
elif [ $OSTYPE == $LINUX ]; then
    SEDFLAG='-r'
else
    echo "hop unknown OSTYPE: $OSTYPE"
fi

# Reset to null
NEWPWD=

# No command line option, try to hop between test and production
if [ -z "$1" ]; then
    if [ -z "$(echo $PWD | grep test_)" ]; then
        NEWPWD=`echo $PWD | sed $SEDFLAG "s~($SHORTWEBROOTS)(s_)?([^/]+)~\1\2test_\3~g"`
    else
        NEWPWD=`echo $PWD | sed 's~test_~~g'`
    fi

# Hop to location given on command line
else
    # Look for user specified custom locations
    if [ -x ~/.hop.sh ]; then
        . ~/.hop.sh
    fi
    
    # If we still haven't gotten our new location figured out
    if [ -z $NEWPWD ]; then
        case $1 in
            home | home/)   NEWPWD=~
                            ;;
            back | back/)   NEWPWD=$HOPBACK
                            ;;
            *)              # In case of multiple web roots, get first one in list
                            SHORTWEBROOT=`echo $SHORTWEBROOTS | sed $SEDFLAG "s~\|.*$~~g"`
                            
                            # If given location ends in slash, force hop to root of domain
                            if [ -n "$(echo $1 | grep '\/')" ]; then
                                NEWPWD=$SHORTWEBROOT$1
                            
                            # Otherwise try to hop to the same spot on new domain if possible
                            else
                                # Swap folder one level after web root in PWD with hop target
                                TESTPATH=`echo $PWD | sed $SEDFLAG "s~($SHORTWEBROOTS)([^/]+)~\1$1~g"`
                                # If the path was not changed by sed, then PWD is not in web root and we need to hop to webroot. If path was changed, and the new path exists, we can hop to same spot on new domain.
                                if [ $PWD != $TESTPATH -a -d $TESTPATH ]; then
                                    NEWPWD=$TESTPATH
                                else
                                    NEWPWD=$SHORTWEBROOT$1
                                fi
                            fi
                            ;;
        esac
    fi
fi

# Finally, do the deed
export HOPBACK=$PWD
cd $NEWPWD
