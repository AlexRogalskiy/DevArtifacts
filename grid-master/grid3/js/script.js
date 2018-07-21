// thanks to Jesse for the JS :) https://twitter.com/Jesse__Taylor

$('#h-align li').click(function() {
  $('#h-align li').removeClass('selected');
  $(this).addClass('selected');
  $('#h-align').removeClass();
  $('#h-align').addClass($(this).attr('value'));
});

 $('.v-align li').click(function() {
  $('.v-align li').removeClass('selected');
  $(this).addClass('selected');
  $('#v-align div').removeClass();
  $('#v-align div').addClass($(this).attr('value'));
});
