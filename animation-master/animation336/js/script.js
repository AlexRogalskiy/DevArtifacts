var config = {
  maxHue: 360,
  minSat: 50,
  maxSat: 85,
  minLight: 50,
  maxLight: 85,
  scaleLight: 15
};

var randomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var Color = function(hue, sat, light) {
  this.hue = hue || randomNum(0, config.maxHue);

  // Remove ugly magenta hues
  if (this.hue > 288 && this.hue < 310) {
    this.hue = randomNum(310, 360);
  } else if (this.hue > 280 && this.hue < 288) {
    this.hue = randomNum(260, 280);
  }

  // Increase ranges for reds
  if (this.hue > 0 && this.hue < 90) {
    config.minSat = 75,
    config.minLight = 70,
    config.maxSat = 100,
    config.maxLight = 80
  }

  this.sat = sat || randomNum(config.minSat, config.maxSat);
  this.light = light || randomNum(config.minLight, config.maxLight);
};

Color.prototype.hsl = function() {
  return 'hsl(' + this.hue + ', ' + this.sat + '%, ' + this.light + '%)';
};

Color.prototype.rgb = function() {
  var rgb = hsl2rgb(this.hue, this.sat, this.light);
  return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
};

Color.prototype.hex = function() {
  var rgb = hsl2rgb(this.hue, this.sat, this.light);
  var hex = rgbToHex([rgb.r, rgb.g, rgb.b]);
  return hex;
};

function hsl2rgb(h, s, l) {
  var m1, m2, hue;
  var r, g, b
  s /= 100;
  l /= 100;
  if (s == 0)
    r = g = b = (l * 255);
  else {
    if (l <= 0.5)
      m2 = l * (s + 1);
    else
      m2 = l + s - l * s;
    m1 = l * 2 - m2;
    hue = h / 360;
    r = Math.round(HueToRgb(m1, m2, hue + 1 / 3));
    g = Math.round(HueToRgb(m1, m2, hue));
    b = Math.round(HueToRgb(m1, m2, hue - 1 / 3));
  }
  return {
    r: r,
    g: g,
    b: b
  };
}

function HueToRgb(m1, m2, hue) {
  var v;
  if (hue < 0)
    hue += 1;
  else if (hue > 1)
    hue -= 1;

  if (6 * hue < 1)
    v = m1 + (m2 - m1) * hue * 6;
  else if (2 * hue < 1)
    v = m2;
  else if (3 * hue < 2)
    v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
  else
    v = m1;

  return 255 * v;
}

var rgbToHex = function(rgb) {
  var hex = [];
  for (var j = 0; j < rgb.length; j++) {
    hex[j] = rgb[j].toString(16);
    if (hex[j].length < 2) {
      hex[j] = '0' + hex[j];
    }
  }
  return '#' + hex.join('');
};

$('h1').click(function(e) {
  clearInterval(t);
  e.stopPropagation();
})

var randomizeColor = function () {
  var c = new Color();
$('body').css('background', c.hsl())
  .find('h1').text(c.hex());
}

randomizeColor();
var t = setInterval(randomizeColor, 1000);


$('body').click(function() {
  clearInterval(t);
  randomizeColor();
});