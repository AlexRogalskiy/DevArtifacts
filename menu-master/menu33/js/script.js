var menu = $('nav#menu');

var watcher = scrollMonitor.create( menu );

watcher.lock();

watcher.stateChange(function() {
  $(menu).toggleClass('scrolled', this.isAboveViewport)
});