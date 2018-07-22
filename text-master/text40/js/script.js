const $focus = document.querySelector('.focused');
const $focusText = document.querySelector('.focused-text');
const $editPane = document.querySelector('.textedit');
const paneLeft = $editPane.offsetLeft;
const paneTop = $editPane.offsetTop;

function focusThing() {
  const $highlight = document.querySelector('.highlight');
  const top = $highlight.offsetTop;
  const textStart = $highlight.offsetLeft;
  // const left = $highlight.offsetLeft;
  $focusText.innerText = $highlight.innerText;
  $focus.style.top = `${top-11}px`;
  $focusText.style['margin-left'] = `${textStart-10}px`;
  
  $focus.classList.add('focused-transition');
}

function unfocusThing() {
  $focus.classList.remove('focused-transition');  
}

document.querySelector('.focus-the-thing').addEventListener('click', () => {
  focusThing();
  return false;
})
document.querySelector('.unfocus-the-thing').addEventListener('click', () => {
  unfocusThing();
  return false;
})