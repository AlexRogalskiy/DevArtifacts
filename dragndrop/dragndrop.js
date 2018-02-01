$('.popup').on('click', updatePopup);

function updatePopup(event) {
  $.get($(event.target).attr('href'), [], updatePopupContent);
  return false;
};

function updatePopupContent(data) {
  var popupWindow = $('div.popup_window');
  // popupWindow.find('.body').html($(data));
  popupWindow.fadeIn();
};

$('.popup_window .close').on('click', hidePopup);
function hidePopup() {
  $(this).parents('.popup_window').fadeOut();
  return false;
};

function isTouchSupported() {
  return 'ontouchmove' in document.documentElement;
};

$('.draggable .handle').on('mousedown', dragPopup);
if (isTouchSupported()) {
  $('.draggable .handle').on('touchstart', dragPopup);
};

function dragPopup(event) {
  event.preventDefault();
  var handle = $(event.target);
  var draggableWindow = $(handle.parents('.draggable')[0]);
  draggableWindow.addClass('dragging');
  var cursor = event;
  if (isTouchSupported()) {
    cursor = event.originalEvent.touches[0];
  }
  var cursorOffset = {
    pageX: cursor.pageX - parseInt(draggableWindow.css('left')),
    pageY: cursor.pageY - parseInt(draggableWindow.css('top'))
  };

  if (isTouchSupported()) {
    $(document).bind('touchmove', function(moveEvent) {
      var currentPosition = moveEvent.originalEvent.touches[0];
      observeMove(moveEvent, cursorOffset,
        currentPosition, draggableWindow);
    });
    $(document).bind('touchend', function(upEvent) {
      unbindMovePopup(upEvent, draggableWindow);
    });
  } else {
    $(document).mousemove(function(moveEvent) {
      observeMove(moveEvent, cursorOffset,
        moveEvent, draggableWindow);
    });
    $(document).mouseup(function(up_event) {
      unbindMovePopup(up_event, draggableWindow);
    });
  }
}
function observeMove(event, cursorOffset, cursorPosition, draggableWindow) {
  event.preventDefault();
  var left = cursorPosition.pageX - cursorOffset.pageX;
  var top  = cursorPosition.pageY - cursorOffset.pageY;
  draggableWindow.css('left', left).css('top', top);
};
function unbindMovePopup(event, draggableWindow) {
  if (isTouchSupported()) {
    $(document).unbind('touchmove');
  } else {
    $(document).unbind('mousemove');
  }
  draggableWindow.removeClass('dragging');
};
