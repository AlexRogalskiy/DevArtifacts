(function() {
  var time = {
    init: function() {
      this.checkbox = $('#time');
      this.bindEvents();
      this.changeTime();
    },
    bindEvents: function() {
      $(this.checkbox).change(this.changeTime.bind(this));
    },
    changeTime: function () {
      if (this.checkbox.is(':checked')) {
        $('body').removeClass().addClass('day');
      } else {
        $('body').removeClass().addClass('night');
      }
    }
  };
  time.init();
})();