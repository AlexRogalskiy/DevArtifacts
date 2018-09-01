// http://particlebanana.com/2016/06/09/using-private-npm-modules-on-heroku/
if(process.env.NODE_ENV !== 'production') {
  return;
}

var fs = require('fs');
fs.writeFileSync('.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}');
fs.chmodSync('.npmrc', 0600);
