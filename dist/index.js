/// <reference types="codemirror" />
var editorHost = document.createElement('div');
editorHost.className = 'editorHost';
document.body.appendChild(editorHost);
var sideHost = document.createElement('div');
sideHost.className = 'sideHost';
document.body.appendChild(sideHost);
var editor = CodeMirror(editorHost, {
// yes
});
//# sourceMappingURL=index.js.map
