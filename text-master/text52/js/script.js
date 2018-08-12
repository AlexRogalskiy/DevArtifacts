$('a').click(function(e) {
  e.preventDefault();
  var $self = $(this);
  
  var modal = '<div class="modal"></div>';
  $('body').append(modal);
  var $modal = $('.modal');
  
  var css = {
    'top': $self.position().top+$self.height()-5+'px',
    'left': $self.position().left+'px',
    'width': $self.width()+'px',
    'height': '5px',
    'transition': '.3s ease-in'
  }
  
 	$modal.css(css);
  
  setTimeout(function() {
    $modal.css({
      'top': 0,
      'left': 0,
      'width': '100%',
      'height': '100%'
    });
  }, 50);
  
  $modal.click(function() {
    $modal.css(css);
    $modal.css('height','5px');
    setTimeout(function() {
      $modal.remove();
    }, 600);
  })
  
});