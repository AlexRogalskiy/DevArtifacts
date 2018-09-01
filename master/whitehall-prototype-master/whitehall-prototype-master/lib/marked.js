var marked = require('marked');

exports.convertMarkdownToHTML = function (text, locals) {
  locals.body_html = marked(text);
}
