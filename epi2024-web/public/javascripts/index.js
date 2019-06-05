
var editor = CodeMirror.fromTextArea(document.getElementById("codeForm"), {
    lineNumbers: true,
    indentWithTabs: true,
    mode: {name: "javascript", json: true},
    value: document.getElementById("codeForm").value,
    theme: "midnight"
});

editor.setSize("100%", "100%");

editor.on("change", function () {
    document.getElementById("codeForm").value = editor.getValue();
});

selector();
 
function selector() {
    var idx = document.getElementById("file-selector").value;

    if (idx == 0) return;
    if (idx == 1){
        idx = "baseModule.js";
        document.getElementById("inputgroup").style.visibility = "visible"; 
    } else if (idx == 2){
        idx = "baseModule.py";
        document.getElementById("inputgroup").style.visibility = "visible"; 
    } else {
        document.getElementById("inputgroup").style.visibility = "hidden"; 
    }

    var ext = idx.substr(-3);
    
    if (ext == ".js"){
        ext = {name: "javascript", json: true};
    } else if (ext == ".py") {
        ext = {name: "python"};
    }
    editor.setOption("mode", ext);
    editor.setValue(previewFiles[idx].data);
}




function validate() {
    var env = document.getElementById("file-selector").value;
    var value = editor.getValue();
    var name = document.getElementById("name").value;
    var author = document.getElementById("author").value;
    var desc = document.getElementById("description").value;
    var ext = "";
    
    if (env == "New Module PY"){
        env = "python3";
        ext = ".py";
    } else if (env == "New Module JS"){
        env = "node";
    ext = ".js";
    }

    $.post("/", {name: name, author: author, description: desc, ext: ext, data: value}, function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
}

function submit() {
    validation = validate();
}