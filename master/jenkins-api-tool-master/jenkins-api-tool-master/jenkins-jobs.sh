#!/bin/bash

PROJECT_PATH=$1
SITE=$2

#Update these variables with your username/password for jenkins
USER="yourusername"
PASSWORD="yourpass"

### The modules array needs to follow a naming convetion that matches your job template config.xml. eg template_one.xml = 'template' in the array ###
declare -a modules=('another_template')


for m in ${modules[@]}; do
   echo "module $m";
   sed "s|REPLACE_ME|$PROJECT_PATH|g" $m.xml > $m-config.xml;
   curl -k -X POST -d @$m-config.xml \
        -H 'Content-Type: application/xml' \
        "https://jenkins.mydomain.com/createItem/?name=$SITE-$m" --user $USER:$PASSWORD;
done


rm *-config.xml
