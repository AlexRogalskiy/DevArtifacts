$(document).ready(() => {
  /**
   * Tabs Component
   */
  if ($('.tabs').length > 0) {
    $('.tabs').each(function () {
      const windowHash = window.location.hash;

      if (windowHash) {
        const tabId = $(`.tabs__item[href="${windowHash}"]`).attr('data-tab');

        $('.tabs__item--active').removeClass('tabs__item--active');
        $(`.tabs__item[href="${windowHash}"]`).addClass('tabs__item--active');

        $('.tabs__panel--active').removeClass('tabs__panel--active');
        $(`.tabs__panel[data-tab=${tabId}]`).addClass('tabs__panel--active');
      }

      $(this).find('.tabs__item').on('click', function () {
        const tabId = $(this).attr('data-tab');

        if ($(this).hasClass('tabs__item--active')) {
          return false;
        }

        $('.tabs__item--active').removeClass('tabs__item--active');
        $(this).addClass('tabs__item--active');

        $('.tabs__panel--active').removeClass('tabs__panel--active');
        $(`.tabs__panel[data-tab=${tabId}]`).addClass('tabs__panel--active');

        return true;
      });
    });
  }

  /**
   * Navigation Component
   */
  // const tl = new TimelineMax();

  $('#navigation__toggle').on('click', function () {
    $(this).parent().toggleClass('navigation--active');
  });

  /**
   * Page Loading
   */
  $('.loading-bar').animate({ width: '100%' }, 300, function () {
    $(this).animate({ opacity: '0' }, 300);
  });
});
