$.dataJs = function(el){
    return $('[data-js=' + el + ']');
};

$.dataJs('toggle-green').on('click', function() {
  
  $(this).toggleClass('green');
  
});
