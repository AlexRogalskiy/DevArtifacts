$(document).ready(function() {
  var animation = false,
      animDur = 1000,
      $row = $('.box__row'),
      $cell = $('.box__row-cell'),
      $content = $('.box__content'),
      $closeBtn = $('.box__close');

  var animFalse = function() {
    animation = false;
  }

  var active = function() {
    if (animation) return;
    var cellData = $(this).data('cell');
    var $content = $('.box__content[data-content=' + cellData + ']');
    animation = true;

    $cell.addClass('cell-fade');
    $(this).addClass('active');
    $content.addClass('show-content');
    $closeBtn.addClass('box-close-active');

    setTimeout(animFalse, animDur);
  }

  var close = function() {
    animation = true;
    
    $cell.removeClass('active cell-fade');
    $content.removeClass('show-content');
    $(this).removeClass('box-close-active');

    setTimeout(animFalse, animDur);
  }

  $row.on('click', '.box__row-cell', active);
  $closeBtn.on('click', close);
  $cell.on({
    mouseenter: function() {
      $cell.addClass('hover-cell');
      $(this).removeClass('hover-cell');
    },
    mouseleave: function() {
      $cell.removeClass('hover-cell');
    }
  });
});