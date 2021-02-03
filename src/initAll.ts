function initAll() {

  const editorHost = document.getElementById('editorHost');
  const sideHost = document.getElementById('sideHost');

  const sideController = initSide(sideHost);

  const editor = initEditor(editorHost, {
    onSelectionChanged(lead, trail) {
      sideController.updateSelection(lead, trail);
    }
  });
  editor.focus();

}