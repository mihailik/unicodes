function initAll() {

  const editorHost = document.getElementById('editorHost');
  const sideHost = document.getElementById('sideHost');

  const sideController = initSide(sideHost);

  const editor = initEditor(editorHost, {
    onSelectionChanged(text) {
      sideController.updateSelection(text);
    }
  });
  editor.focus();

}