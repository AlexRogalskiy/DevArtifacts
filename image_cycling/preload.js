(function($){
  var images = [
    '<img src="images/lake-bench-slide.jpg">',
    '<img src="images/old-building-slide.jpg">',
    '<img src="images/oldbarn-slide.jpg">',
    '<img src="images/streetsign-with-highlights-slide.jpg">',
    '<img src="images/water-stairs-slide.jpg">'
  ];

  $('#slideshow').cycle(
    {
      fx: 'fade',
      load: true,
      progressive: images
    }
  );
})(jQuery);
