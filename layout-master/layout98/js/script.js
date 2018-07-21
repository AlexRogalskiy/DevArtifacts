// prithee, judge me not by my jQuery 

function getRandomNum(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function poemScramble() {
  randomSonnet = getRandomNum(153);
  randomLine = getRandomNum(13);
}

var randomSonnet;
var randomLine;
var sonnets;
var url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/652/sonnets.json";

$.ajax({
  url: url,
  async: false,
  success: function(data) {
    sonnets = data;
  }
});

$(".poem").each(function(){
  for (var i = 0; i < 14; i++) {
  poemScramble();
  $(this).append(
    '<p class="line">' + sonnets[randomSonnet].lines[randomLine] + "</p>"
  );
}
});


$(".poem > p").on("click", function() {
  poemScramble();
  $(this).fadeOut(function() {
    $(this).text(sonnets[randomSonnet].lines[randomLine]).fadeIn();
  });
  
});
