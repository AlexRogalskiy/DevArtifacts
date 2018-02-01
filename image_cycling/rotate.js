(function($){
  function setupButton() {
    var $pauseButton, $slideShow;

    $slideShow = $('#slideshow');
    $pauseButton = $('<button>Pause</button>');

    $pauseButton.on('click', function() {
      if (isPaused($slideShow)) {
        playSlideShow($slideShow, $(this));
      } else {
        pauseSlideShow($slideShow, $(this));
      }
    });

    function isPaused($player) {
      return $player.is('.cycle-paused');
    }

    function playSlideShow($player, $button) {
      $player.cycle('resume');
      $button.html('Pause');
    }

    function pauseSlideShow($player, $button) {
      $player.cycle('pause');
      $button.html('Resume');
    }

    $pauseButton.insertAfter($slideShow);
  }
  $('#slideshow').cycle({fx: 'toss'});//fade / toss / uncover
  setupButton();

})(jQuery);
