## Maximum width or height in a set of elements

var getMaxHeight = function ($elms) {
  var maxHeight = 0;
  $elms.each(function () {
    // In some cases you may want to use outerHeight() instead
    var height = $(this).height();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });
  return maxHeight;
};

$(elements).height( getMaxHeight($(elements)) );



## Validating a date effectively

function isValidDate(value, userFormat) {
 
  // Set default format if format is not provided
  userFormat = userFormat || 'mm/dd/yyyy';
 
  // Find custom delimiter by excluding
  // month, day and year characters
  var delimiter = /[^mdy]/.exec(userFormat)[0];
 
  // Create an array with month, day and year
  // so we know the format order by index
  var theFormat = userFormat.split(delimiter);
 
  // Create array from user date
  var theDate = value.split(delimiter);
 
  function isDate(date, format) {
    var m, d, y, i = 0, len = format.length, f;
    for (i; i < len; i++) {
      f = format[i];
      if (/m/.test(f)) m = date[i];
      if (/d/.test(f)) d = date[i];
      if (/y/.test(f)) y = date[i];
    }
    return (
      m > 0 && m < 13 &&
      y && y.length === 4 &&
      d > 0 &&
      // Check if it's a valid day of the month
      d <= (new Date(y, m, 0)).getDate()
    );
  }
 
  return isDate(theDate, theFormat);
}

isValidDate('dd-mm-yyyy', '31/11/2012')

## Setting breakpoints for responsive design

function isBreakPoint(bp) {
  // The breakpoints that you set in your css
  var bps = [320, 480, 768, 1024];
  var w = $(window).width();
  var min, max;
  for (var i = 0, l = bps.length; i < l; i++) {
    if (bps[i] === bp) {
      min = bps[i-1] || 0;
      max = bps[i];
      break;
    }
  }
  return w > min && w <= max;
}

if ( isBreakPoint(320) ) { 
  // breakpoint at 320 or less
}
if ( isBreakPoint(480) ) { 
  // breakpoint between 320 and 480
}


## Highlighting text

function highlight(text, words, tag) {
 
  // Default tag if no tag is provided
  tag = tag || 'span';
 
  var i, len = words.length, re;
  for (i = 0; i < len; i++) {
    // Global regex to highlight all matches
    re = new RegExp(words[i], 'g');
    if (re.test(text)) {
      text = text.replace(re, '<'+ tag +' class="highlight">$&</'+ tag +'>');
    }
  }
 
  return text;
}

function unhighlight(text, tag) {
  // Default tag if no tag is provided
  tag = tag || 'span';
  var re = new RegExp('(<'+ tag +'.+?>|<\/'+ tag +'>)', 'g');
  return text.replace(re, '');
}


$('p').html( highlight(
    $('p').html(), // the text
    ['foo', 'bar', 'baz', 'hello world'], // list of words or phrases to highlight
    'strong' // custom tag
));

## Animated text effects

$.fn.animateText = function(delay, klass) {
  
  var text = this.text();
  var letters = text.split('');
  
  return this.each(function(){
    var $this = $(this);
    $this.html(text.replace(/./g, '<span class="letter">$&</span>'));
    $this.find('span.letter').each(function(i, el){
      setTimeout(function(){ $(el).addClass(klass); }, delay * i);
    });
  });
  
};

$('p').animateText(15, 'foo');


## Fading elements one by one

$.fn.fadeAll = function (ops) {
  var o = $.extend({
    delay: 500, // delay between elements
    speed: 500, // animation speed
    ease: 'swing' // other require easing plugin
  }, ops);
  var $el = this;
  for (var i=0, d=0, l=$el.length; i<l; i++, d+=o.delay) {
    $el.eq(i).delay(d).fadeIn(o.speed, o.ease);
  }
  return $el;
}

$(elements).fadeAll({ delay: 300, speed: 300 });

## Counting clicks


$(element)
    .data('counter', 0) // begin counter at zero
    .click(function() {
        var counter = $(this).data('counter'); // get
        $(this).data('counter', counter + 1); // set
        // do something else...
    });

## Embedding Youtube videos from links

function embedYoutube(link, ops) {
 
  var o = $.extend({
    width: 480,
    height: 320,
    params: ''
  }, ops);
 
  var id = /\?v\=(\w+)/.exec(link)[1];
 
  return '<iframe style="display: block;"'+
    ' class="youtube-video" type="text/html"'+
    ' width="' + o.width + '" height="' + o.height +
    ' "src="http://www.youtube.com/embed/' + id + '?' + o.params +
    '&amp;wmode

embedYoutube(
  'https://www.youtube.com/watch?v=JaAWdljhD5o', 
  { params: 'theme=light&fs=0' }
);


## Reducing text by word limit

function excerpt(str, nwords) {
  var words = str.split(' ');
  words.splice(nwords, words.length-1);
  return words.join(' ') + 
    (words.length !== str.split(' ').length ? '&hellip;' : '');
}

## Creating dynamic menus


function makeMenu(items, tags) {
 
  tags = tags || ['ul', 'li']; // default tags
  var parent = tags[0];
  var child = tags[1];
 
  var item, value = '';
  for (var i = 0, l = items.length; i < l; i++) {
    item = items[i];
    // Separate item and value if value is present
    if (/:/.test(item)) {
      item = items[i].split(':')[0];
      value = items[i].split(':')[1];
    }
    // Wrap the item in tag
    items[i] = '<'+ child +' '+ 
      (value && 'value="'+value+'"') +'>'+ // add value if present
        item +'</'+ child +'>';
  }
 
  return '<'+ parent +'>'+ items.join('') +'</'+ parent +'>';
}

// Dropdown select month
makeMenu(
  ['January:JAN', 'February:FEB', 'March:MAR'], // item:value
  ['select', 'option']
);
 
// List of groceries
makeMenu(
  ['Carrots', 'Lettuce', 'Tomatos', 'Milk'],
  ['ol', 'li']
);







































