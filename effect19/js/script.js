
var grid = {    //You can play width this value
  width: 30,    //cells X
  height: 20,   //cells Y
  margin: 2     //Margin bewteen cells
};

var selector = $('#bubble-board');    //Bubble container

var prefix = (function() {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

var cell_width = selector.width() / grid.width;
var cell_height = cell_width;

$(function() {
  for (var j = 0; j < grid.width; j += 1) {
    for (var i = 0; i < grid.height; i += 1) {
      var grid_cell = $('<div>').addClass('grid-cell');
      var grid_cell_action = $('<a>').click(function() {
        $(this).parent().removeClass('tl tr br bl');
        if ($(this).parent().hasClass('on')) {
          $(this).parent().removeClass('on');
          un_checkAdjacent($(this).parent());
        } else {
          $(this).parent().addClass('on');
          adjacentCheck($(this).parent());
        }
      });

      grid_cell_action.appendTo(grid_cell);
      grid_cell.appendTo(selector);

      var css = {};
      css[prefix.css + 'transform'] = 'translate3d(' + (j * cell_width) + 'px,' + (i * cell_height) + 'px, 0)';

      grid_cell.css(css).attr({
        'data-j': j,
        'data-i': i
      });
    }
  }

  $('.grid-cell').css({
    width: cell_width,
    height: cell_height,
  });

  $('.grid-cell > a').css({
    top: grid.margin / 2,
    right: grid.margin / 2,
    bottom: grid.margin / 2,
    left: grid.margin / 2
  });
  
  $('h1').click(function() {
    $(this).fadeOut('slow', function() {
      $(this).remove();
    });
  });
});

function adjacentCheck(grid_element) {
  var j = parseInt(grid_element.attr('data-j'));
  var i = parseInt(grid_element.attr('data-i'));

  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on')) {
    grid_element.addClass('tl');
    $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').addClass('br');
  }
  if ($('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on')) {
    grid_element.addClass('tl tr');
    $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').addClass('bl br');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on')) {
    grid_element.addClass('tr');
    $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').addClass('bl');
  }
  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    grid_element.addClass('tl bl');
    $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').addClass('tr br');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    grid_element.addClass('tr br');
    $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').addClass('tl bl');
  }
  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on')) {
    grid_element.addClass('bl');
    $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').addClass('tr');
  }
  if ($('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on')) {
    grid_element.addClass('bl br');
    $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').addClass('tl tr');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on')) {
    grid_element.addClass('br');
    $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').addClass('tl');
  }
}

function un_checkAdjacent(grid_element) {
  var j = parseInt(grid_element.attr('data-j'));
  var i = parseInt(grid_element.attr('data-i'));

  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').removeClass('br')
  }
  if ($('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on')) {
    if (!$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').removeClass('bl');
    if (!$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').removeClass('br');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').removeClass('bl');
  }
  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    if (!$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').removeClass('tr');
    if (!$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').removeClass('br');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    if (!$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i - 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i - 1) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').removeClass('tl');
    if (!$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').removeClass('bl');
  }
  if ($('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on')) {
    $('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').removeClass('tr');
  }
  if ($('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on')) {
    if (!$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j - 1) + '"][data-i="' + (i) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').removeClass('tl');
    if (!$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on'))
      $('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').removeClass('tr');
  }
  if ($('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j) + '"][data-i="' + (i + 1) + '"]').hasClass('on') && !$('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i) + '"]').hasClass('on')) {
    $('.grid-cell[data-j="' + (j + 1) + '"][data-i="' + (i + 1) + '"]').removeClass('tl');
  }
}