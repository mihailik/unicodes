declare namespace initEditor {
  type Options = {
    onSelectionChanged: (selectionText: string) => void;
  }
}

function initEditor(editorHost: HTMLElement, options?: Partial<initEditor.Options>) {

  const urlText = getUrlText();
  var editor = CodeMirror(
    editorHost,
    {
      value: urlText
    });
  
  CodeMirror.on(editor, 'changes', handleEditorChanges);
  CodeMirror.on(editor, 'cursorActivity', handleCursorActivity);
  return editor;

  var syncEditorUrlTimeout: any;
  var syncCursorTimeout: any;

  function handleEditorChanges(e_: CodeMirror.Editor, changes: CodeMirror.EditorChangeLinkedList[]) {
    clearTimeout(syncEditorUrlTimeout);
    syncEditorUrlTimeout = setTimeout(updateUrlFromEditor, 600);
  }

  function updateUrlFromEditor() {
    const value = editor.getValue();
    const urlText = getUrlText();
    if (urlText === value) return;

    const usePushState = !!(initEditor as any).usePushState;

    if (usePushState && typeof history !== 'undefined' && history && typeof history.pushState === 'function') {
      history.pushState({}, '', location.pathname + '?' + encodeValue(value));
      location.hash = '';
    }
    else {
      location.hash = '#' + encodeValue(value);
    }
  }

  function encodeValue(value: string) {
    return encodeURIComponent(value).replace(/%20/g, ' ');
  }

  function getUrlText() {
    const hashText = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    const queryText = decodeURI((location.search || '').replace(/^\?/, ''));
    return (
      location.hash ? hashText :
        location.search ? queryText : 
          ''
    );
  }

  function handleCursorActivity() {
    clearTimeout(syncCursorTimeout);
    syncCursorTimeout = setTimeout(updateSideBarForSelection, 200);
  }

  function updateSideBarForSelection() {
    let selectionText = editor.getSelection();
    if (!selectionText) {
      const value = editor.getValue();
      const cursorOffset = editor.indexFromPos(editor.getCursor());
      const lead = cursorOffset ? value.charAt(cursorOffset - 1) : '';
      const trail = cursorOffset < value.length ? value.charAt(cursorOffset) : '';
      selectionText = lead + trail;
    }

    const onSelectionChanged = options && options.onSelectionChanged;
    if (typeof onSelectionChanged === 'function')
      onSelectionChanged(selectionText);
  }
}