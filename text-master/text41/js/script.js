const $editor = document.querySelector('.textedit');
let hasHighlight = false;
let mousedown = false;

rangy.init();
const hl = rangy.createHighlighter();
// will create a new highlighter class for each thing?
hl.addClassApplier(
  rangy.createClassApplier("highlight", {
    ignoreWhiteSpace: true,
    tagNames: ["span", "a"]
  })
);

document.addEventListener("mouseup", () => {
  if (!hasHighlight) {
    const high = hl.highlightSelection("highlight");
    hasHighlight = true;
    console.log(high);
  }
  $editor.classList.remove('ondrag');
  mousedown = false;
});

document.addEventListener("mousedown", (e) => {
  const isEditor = isEditorChild(e.target);
  if (isEditor) {
    $editor.classList.add('ondrag');
  }
  mousedown = true;
});

document.addEventListener('mousemove', (e) => {
  const { clientX: x, clientY: y } = e;
  
})

document.onselectionchange = function() {
  
};

function isEditorChild(el) {
  if (el === document) return false;
  if (el === $editor) return true;
  return isEditorChild(el.parentElement);
}