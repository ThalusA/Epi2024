hashCode = function (s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
};

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
 
function selector(e) {
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

function validate(e, callback) {
    let env = document.getElementById("file-selector").value;
    let value = editor.getValue();
    let ext = env.substr(-3);
    
    if (env == 0) return;
    else if (env == 2){
        env = "python3";
        ext = ".py";
    } else if (env == 1) {
        env = "node";
        ext = ".js";
    } else if (ext == ".js") {
        env = "node";
    } else if (ext == ".py") {
        env = "python3";
    }

    if (document.getElementById("debug").style.visibility == "hidden")
        

    document.getElementById("loader").style.visibility = "visible";
    fetch('/validate', {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "Accept": "application/json"
        }),
        body: JSON.stringify({
            ext: ext,
            env: env,
            data: value
        })
    }).then(function (response) {
        response.json().then(function (data) {
            document.getElementById("debugpre").innerText = JSON.stringify(data, undefined, 4).replace("\n", "\r\n");
            document.getElementById("debug").style.visibility = "visible";
            if (response.ok) {
                console.log("Validation complete");
                if (callback) callback(1, env, ext, value);
                else document.getElementById("loader").style.visibility = "hidden";
            } else {
                console.log("Validation failed");
                if (callback) callback(0);
                else document.getElementById("loader").style.visibility = "hidden";

            }
        });
    }).catch(function (error) {
        console.log("Validation failed (Cannot process request)");
        document.getElementById("debugpre").innerText = error.message;
        if (callback) callback(0);
        else document.getElementById("loader").style.visibility = "hidden";
    });
}

function submit(e) {
    validate(e, function (cb, env, ext, value){
        if (cb)
            fetch('/submit', {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }),
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    description: document.getElementById("description").value,
                    author: document.getElementById("author").value,
                    state: "Request In Progress",
                    id: hashCode(document.getElementById("name").value + document.getElementById("author").value),
                    data: value,
                    extension: ext,
                    environment: env,
                    date: (new Date()).getTime()
                })
            }).then(function (response) {
                if (response.ok) console.log("Submition complete");
                else console.log("Submition failed");
                document.getElementById("loader").style.visibility = "hidden";
            }).catch(function (error) {
                console.log("Submition failed (Cannot process request)");
                document.getElementById("debugpre").innerText = error.message;
                document.getElementById("loader").style.visibility = "hidden";
            });
    });
}

document.getElementById('validate').addEventListener("click", validate);
document.getElementById('submit').addEventListener("click", submit);
document.getElementById("file-selector").addEventListener("change", selector);