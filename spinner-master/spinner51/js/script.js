document.querySelector('button').addEventListener('click', function(evt) {
  this.textContent = this.textContent === 'hide' ? 'show' : 'hide';
  document.querySelector('html').classList.toggle('loading');
}, false);