document.querySelector('.title').addEventListener('mousemove', (e) => {

  const x = e.pageX - e.target.offsetLeft

  e.target.style.setProperty('--x', `${ x }`)
 
});