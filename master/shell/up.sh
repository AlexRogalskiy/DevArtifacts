#!/bin/bash
LEVEL=$1
for ((i = 1; i <= LEVEL; i++))
do
CDIR=../$CDIR
done
cd $CDIR
echo "You are in: "$PWD
exec /bin/bash