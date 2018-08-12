'use strict';

/*
* Require the path module
*/
const path = require('path');

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Origin');

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'patterns'));

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));

/*
 * Custom settings
 */

fractal.components.set('default.preview', '@preview');

fractal.components.set('label', 'Patterns');

fractal.components.set('title', 'Patterns');

const engine = fractal.components.engine();
const handlebars = engine.handlebars;

handlebars.registerHelper('previewTitle', function(target) {
  return new handlebars.SafeString(`Preview - ${target.title}`);
});

// https://github.com/helpers/helper-markdown
// https://github.com/jonschlinkert/remarkable
const markdown = require('helper-markdown')({
  html: false,
  linkify: false,
  typographer: true
});

handlebars.registerHelper('markdown', function(text) {
  if (typeof text === 'string') {
    return new handlebars.SafeString(markdown(text));
  } else {
    return new handlebars.SafeString(markdown(text.fn(this)));
  }
});
