$(document).ready(function() {
  var $burger = $('.burger'),
      $topLine = $('.burger__line-top'),
      $midLine = $('.burger__line-mid'),
      $menuLine = $('.burger__menu'),
      anim = false;

  var changeClasses = {
    addActive: function() {
      for (var i = 0; i <= 2; i++) {
        $burger.children().eq(i).removeClass('reverseLine' + (i + 1)).addClass('activeLine' + (i + 1));
      }
    },
    addReverse: function() {
      for (var i = 0; i <= 2; i++) {
        $burger.children().eq(i).removeClass('activeLine' + (i + 1)).addClass('reverseLine' + (i + 1));
      }
    }
  }

  var timeouts = {
    initial: function(child, Y, rot, scale) {
      $burger.children().eq(child).css('transform', 'translateY(' + Y + 'px) rotate(' + rot + 'deg) scale(' + scale + ',1)');
    },
    afterActive: function() {
      // ES6
      setTimeout(()=> {
        this.initial(0, 12, 45, 1.40);
        this.initial(1, -12, -45, 1.40);
        this.initial(2, 35, 0, 1);
        $burger.children().eq(2).css('opacity', '0');
        anim = true;
      }, 1300);
      // With bind()
      // setTimeout(function() {
      //   this.initial(0, 12, 45, 1.40);
      //   this.initial(1, -12, -45, 1.40);
      //   this.initial(2, 35, 0, 1);
      //   $burger.children().eq(2).css('opacity', '0');
      //   anim = true;
      // }.bind(this), 1300);
    },
    beforeReverse: function() {
      setTimeout(()=> {
        for (var i = 0; i <= 2; i++) {
          this.initial(i, 0, 0, 1);
        }
        $burger.children().eq(2).css('opacity', '1');
        anim = false;
      }, 1300);
    }
  }

  $burger.on('click', function() {
    if (!anim) {
      changeClasses.addActive();
      timeouts.afterActive();
    } else if (anim) {
      changeClasses.addReverse();
      timeouts.beforeReverse();
    }
  });
});