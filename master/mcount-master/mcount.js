(function() {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var end = mcountConfig.end;
  var start = mcountConfig.start;

  var eventTime = end.unix();
  var currentTime = start.unix();
  var diffTime = eventTime - currentTime;
  var duration = moment.duration(diffTime * 1000);
  var interval = 1000;

  setInterval(function() {
    duration = moment.duration(duration - interval);

    querySelector('[data-mcount="years"]').innerHTML = duration.years();
    querySelector('[data-mcount="months"]').innerHTML = duration.months();
    querySelector('[data-mcount="days"]').innerHTML = duration.days();
    querySelector('[data-mcount="hours"]').innerHTML = duration.hours();
    querySelector('[data-mcount="minutes"]').innerHTML = duration.minutes();
    querySelector('[data-mcount="seconds"]').innerHTML = duration.seconds();
  }, interval);
})();
