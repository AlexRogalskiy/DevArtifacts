document
  .querySelector('ul')
  .addEventListener('click', function(e){
    smoothScrollTo(selected(e.target, this).offsetTop, this);
  });

function smoothScrollTo(destination, parent, time) {
	let scroll = init();
  requestAnimationFrame(shouldScroll);

  function init() {
    let start = parent.scrollTop;
    let ticks = time || 30;
    let i = 0;
    let positionY = () => (destination - start) * i / ticks + start;
    let isFinished = () => i++ >= ticks;
    return {positionY, isFinished};
  }

  function shouldScroll() {
    if(scroll.isFinished()) return;
    parent.scrollTop = scroll.positionY();
    requestAnimationFrame(shouldScroll);
  }
}

function selected(elem, parent) {
  for(let i = 0; i < parent.children.length; i++) {
    parent.children[i].classList.remove('is-selected');
  }
  elem.classList.add('is-selected');
  return elem;
}