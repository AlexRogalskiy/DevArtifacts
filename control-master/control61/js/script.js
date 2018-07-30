var parts = document.querySelectorAll('.part');

parts.forEach(function(el){
  el.addEventListener('click', function(){
    this.classList.toggle('is-selected');
  });
});