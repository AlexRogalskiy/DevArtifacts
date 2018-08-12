var morph = document.querySelector('.morph');
var stages = ['morph--circle', 'morph--card', 'morph--default'];

const cycleClass = () => {
  const idx = stages.findIndex(x => x === morph.classList["1"]);
  morph.classList.remove(morph.classList["1"]);
  morph.classList.add(idx > 1 ? stages[0] : stages[idx + 1]);
}

morph.addEventListener('click', () => {
  cycleClass();
});