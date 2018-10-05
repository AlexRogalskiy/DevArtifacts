Tripetto.Editor.Open(
  DEMO,
  {
    DisableCloseButton: true,
    DisableEditButton: true,
    DisableSaveButton: true,
    ShowTutorial: true,
    Zoom: "fit-horizontal"
  });

const fnTutorial = () => {
  if (tutorial) {
    editor.Tutorial();
    
    tutorial = false;
  }
};

window.addEventListener("focus", fnTutorial);
window.addEventListener("mousedown", fnTutorial);
window.addEventListener("mousemove", fnTutorial);
window.addEventListener("touchstart", fnTutorial);
window.addEventListener("pointerstart", fnTutorial);