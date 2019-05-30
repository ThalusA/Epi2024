document.getElementById("codeForm").value = "";
document.getElementById("file-selector").value = "Select Module";
var editor = CodeMirror.fromTextArea(document.getElementById("codeForm"), {
    lineNumbers: true,
    indentWithTabs: true,
    mode: {name: "javascript", json: true}
});
editor.setSize("100%", "100%");

function selector() {
    var idx = document.getElementById("file-selector").value;
    if (idx == "New Module PY"){
        idx = "baseModule.py";
    } else {
        if (idx == "New Module JS"){
            idx = "baseModule.js";
        }
    }
    var ext = idx.substr(-3);
    if (ext == ".js"){
        ext = {name: "javascript", json: true};
    } else {
        if (ext == ".py"){
            ext = {name: "python"};
        }
    }
    editor.setOption("mode", ext);
    editor.setValue(previewFiles[idx].data);
}