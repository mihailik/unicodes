function initEditor(editorHost: HTMLElement) {
  var editor = CodeMirror(
    editorHost,
    {
      // yes
    });
  return editor;
}