var nbOptions = 9;
var angleStart = -360;



function rotate(li,d) {
    $({d:angleStart}).animate({d:d}, {
        step: function(now) {
            $(li)
               .css({ transform: 'rotate('+now+'deg)' })
               .find('label')
                  .css({ transform: 'rotate('+(-now)+'deg)' });
        }, duration: 0
    });
}


function toggleOptions(s, cb) {
  if (!cb || typeof(cb) !== 'function') cb = function() {};

  $(s).toggleClass('open');
  var li = $(s).find('li');
  var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
  for(var i=0; i<li.length; i++) {
      var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
      $(s).hasClass('open') ? rotate(li[i],d) : rotate(li[i],angleStart);
  }

  return cb();
}

var results = '<li>One</li><li>Two</li><li>Three</li><li>Four</li><li>Five</li><li>Six</li><li>Seven</li><li>Eight</li><li>Nine</li><li>Ten</li><li>Eleven</li><li>Twelve</li><li>Thirteen</li><li>Fourteen</li><li>Fifteen</li><li>Sixteen</li><li>Seventeen</li><li>Eighteen</li><li>Nineteen</li><li>Twenty</li><li>Twentyone</li><li>Twentytwo</li><li>Twentythree</li><li>Twentyfour</li><li>Twentyfive</li><li>Twentysix</li><li>Twentyseven</li><li>Twentyeight</li><li>Twentynine</li><li>Thirty</li><li>Thirtyone</li><li>Thirtytwo</li><li>Thirtythree</li><li>Thirtyfour</li><li>Thirtyfive</li><li>Thirtysix</li><li>Thirtyseven</li><li>Thirtyeight</li><li>Thirtynine</li><li>Fourty</li><li>Fourtyone</li><li>Fourtytwo</li><li>Fourtythree</li><li>Fourtyfour</li><li>Fourtyfive</li><li>Fourtysix</li><li>Fourtyseven</li><li>Fourtyeight</li><li>Fourtynine</li><li>Fifty</li><li>Fiftyone</li><li>Fiftytwo</li><li>Fiftythree</li><li>Fiftyfour</li><li>Fiftyfive</li><li>Fiftysix</li><li>Fiftyseven</li><li>Fiftyeight</li><li>Fiftynine</li><li>Sixty</li><li>Sixtyone</li><li>Sixtytwo</li><li>Sixtythree</li><li>Sixtyfour</li><li>Sixtyfive</li><li>Sixtysix</li><li>Sixtyseven</li><li>Sixtyeight</li><li>Sixtynine</li><li>Seventy</li><li>Seventyone</li><li>Seventytwo</li><li>Seventythree</li><li>Seventyfour</li><li>Seventyfive</li><li>Seventysix</li><li>Seventyseven</li><li>Seventyeight</li><li>Seventynine</li><li>Eighty</li><li>Eightyone</li><li>Eightytwo</li><li>Eightythree</li><li>Eightyfour</li><li>Eightyfive</li><li>Eightysix</li><li>Eightyseven</li><li>Eightyeight</li><li>Eightynine</li><li>Ninety</li><li>Ninetyone</li><li>Ninetytwo</li><li>Ninetythree</li><li>Ninetyfour</li><li>Ninetyfive</li><li>Ninetysix</li><li>Ninetyseven</li><li>Ninetyeight</li><li>Ninetynine</li>';

$('.selector button').click(function(e) {

  toggleOptions('.selector', function(){
    
    var isOpen = $('.selector').hasClass('open');
    if(isOpen) {
      $('.selector').removeClass('closed');
      $('.search-results').empty().hide();
    } else {
      $('.selector').addClass('closed');
      $('.search-results').show();

      setTimeout(function(){

        $('.search-results').empty().show().html('<li>LOADING...</li>');
        setTimeout(function(){
          $('.search-results').html(results);
          stroll.bind( 'ul.search-results')
        },500);

      },1000);
    }
  });


      

});