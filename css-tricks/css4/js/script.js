$(document).ready(function () {
  $('#cb1').on('click', function (e) {
    $('#yours').toggleClass('boldify');
        $('#theirs').toggleClass('boldify');
    
    var $img = $('img');
    if ($img.attr('src') == "http://universe-beauty.com/albums/astronomy_photo/A-Huge-Impact-Crater-on-Mars.gif") {
        $img.attr('src', "https://i1.wp.com/www.poptechjam.com/wp-content/uploads/2015/04/redmars.jpg");
    } else {
        $img.attr('src', 'http://universe-beauty.com/albums/astronomy_photo/A-Huge-Impact-Crater-on-Mars.gif');
    }
    
    
  });
});

