declare namespace initEditor {
  type Options = {
    onSelectionChanged: (beforeText: string[], afterText: string[]) => void;
  }
}

function initEditor(editorHost: HTMLElement, options?: Partial<initEditor.Options>) {

  const regex_split = new RegExp('', 'ug');

  const urlText = getUrlText();
  var editor = CodeMirror(
    editorHost,
    {
      value: urlText
    });
  
  CodeMirror.on(editor, 'changes', handleEditorChanges);
  CodeMirror.on(editor, 'cursorActivity', handleCursorActivity);
  handleCursorActivity();

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
      location.hash = !value ? '' : '#' + encodeValue(value);
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
    syncCursorTimeout = setTimeout(updateSideBarForSelection, 50);
  }

  function updateSideBarForSelection() {
    const onSelectionChanged = options && options.onSelectionChanged;
    if (typeof onSelectionChanged === 'function') {
      const selectionStart = editor.getCursor('start');
      const selectionEnd = editor.getCursor('end');
      const cursorCoord = editor.getCursor();
      if (!CodeMirror.cmpPos(selectionStart, selectionEnd)) {
        const lineText = editor.getLine(cursorCoord.line);
        const unicodeChars = lineText.split(regex_split);
        let charOffset = 0;
        let charIndex = 0;
        for (const uch of unicodeChars) {
          const next = charOffset + uch.length;
          if (next > cursorCoord.ch)
            break;
          charOffset = next;
          charIndex++;
        }

        const lead = charIndex ? unicodeChars[charIndex - 1] : '';
        const trail = unicodeChars[charIndex] || '';
        onSelectionChanged(/\S/.test(lead) ? [lead] : [], /\S/.test(trail) ? [trail] : []);
      }
      else {
        const selectionText = editor.getRange(selectionStart, selectionEnd);
        const cursorSelectionOffset = editor.indexFromPos(cursorCoord) - editor.indexFromPos(selectionStart);
        const lead = selectionText.slice(0, cursorSelectionOffset).replace(/\s+/g, ' ').replace(/^\s+/, '').replace(/\s+$/, '').split(regex_split);
        const trail = selectionText.slice(cursorSelectionOffset).replace(/\s+/g, ' ').replace(/^\s+/, '').replace(/\s+$/, '').split(regex_split);

        onSelectionChanged(lead, trail);
      }
    }
  }
}