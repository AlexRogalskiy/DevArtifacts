// Credit to:
// https://coderwall.com/p/fhgu_q/inlining-images-with-gulp-sass
var fs = require('fs');
var path = require('path');
var types = require('node-sass').types;

var svg = function (buffer) {
    var svg = encodeURIComponent(buffer.toString());

    return '"data:image/svg+xml,' + svg + '"';
};

var img = function (buffer, ext) {
    return '"data:image/' + ext + ';base64,' + buffer.toString('base64') + '"';
};

module.exports = function () {
    return {
        'inline-image($file)': function (file) {
            var filePath = path.resolve(path.dirname(this.options.file), file.getValue());
            // get the file ext
            var ext = filePath.split('.').pop();

            // read the file
            var data = fs.readFileSync(filePath);

            var buffer = new Buffer(data);
            var str = ext === 'svg' ? svg(buffer) : img(buffer, ext);
            return types.String(str);
        }
    };
};
