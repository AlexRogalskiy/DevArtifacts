Package.describe({
  name: 'onokumus:metismenujs',
  version: '1.0.0',
  summary: 'A menu plugin',
  git: 'https://github.com/onokumus/metismenujs',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.addFiles([
    "dist/metismenujs.css",
    "dist/metismenujs.js"
  ], 'client');
});
