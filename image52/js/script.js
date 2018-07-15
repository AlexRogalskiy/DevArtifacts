  $('document').ready(function () {
    var trigger = $('#hamburger'),
        isClosed = true;

    trigger.click(function () {
      burgerTime();
    });

    function burgerTime() {
      if (isClosed == true) {
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = false;
      } else {
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = true;
      }
    }

  });