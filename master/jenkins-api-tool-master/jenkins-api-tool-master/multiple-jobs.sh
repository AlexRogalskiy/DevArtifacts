#!/bin/bash

while read line
do
  path_var=$(echo $line | awk '{split($0,array," ")} END{print array[1]}')
  name_var=$(echo $line | awk '{split($0,array," ")} END{print array[2]}')

  echo "sh test.sh $path_var $name_var"
  bash jenkins-jobs.sh $path_var $name_var

done < params_list.txt

