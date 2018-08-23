$('button').on('click', function() {
	$('img').attr('src', 'https://via.placeholder.com/600x400');
});

// $('.container').imagesLoaded(function() {
// 	$('.container').append('<p>Loaded!</p>');
// });

$('.container').imagesLoaded()
	.always( function( instance ) {
    console.log('all images loaded');
  })
  .done( function( instance ) {
    console.log('all images successfully loaded');
  })
  .fail( function() {
    console.log('all images loaded, at least one is broken');
  })
  .progress( function( instance, image ) {
    var result = image.isLoaded ? 'loaded' : 'broken';
    console.log( 'image is ' + result + ' for ' + image.img.src );
  });


$('.container').append('<p>Ready...</p>');
