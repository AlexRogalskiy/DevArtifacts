let html = document.querySelector('html');
let logo = document.querySelector('.logo');
let clip = document.querySelector('.clip');
window.addEventListener('scroll', function(e) {
  logo.setAttribute('transform',`translate(0 ${html.scrollTop / 10 + 5})`);
  clip.setAttribute('transform',`translate(0 -${html.scrollTop / 10 + 5})`);
});