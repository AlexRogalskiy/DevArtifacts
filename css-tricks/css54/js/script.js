const stage = document.getElementById('stage');
const offsetLeft = stage.offsetLeft;
const offsetTop = stage.offsetTop;

const pointer = document.getElementById('pointer');

let currentX, currentY;


document.getElementById('stage').addEventListener('mousedown', onMouseDown);
function onMouseDown(e) {
  currentX = e.clientX - offsetLeft;
  currentY = e.clientY - offsetTop;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
  currentX = e.clientX - offsetLeft;
  currentY = e.clientY - offsetTop;
  updatePointer();
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function updatePointer() {
  pointer.setAttribute('cx', currentX);
  pointer.setAttribute('cy', currentY);
}