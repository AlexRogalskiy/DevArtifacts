#!/usr/bin/env bash
rm -rf $1/www/build && cp -r ./build $1/www/build
cp $2 $1/www/index.html
sed -i '' -e 's/<script/<script src="cordova.js"><\/script><script/' $1/www/index.html
sed -i '' -e 's/src="\/build/src=".\/build/g' $1/www/index.html
cd $1
cordova build $3
cordova run $3