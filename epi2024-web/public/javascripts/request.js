function accept(id){
    fetch('/request/accept/' + id).then(function (response) {
        if (response.ok) {
            document.getElementById(id + "C").className = "container-fluid bg-success";
            console.log("Approval complete");
        } else console.log("Approval failed");
    }).catch(function (error) {
        console.log("Approval failed (Cannot process request)");
        console.error(error);
    });
}

function refuse(id){
    fetch('/request/refuse/' + id).then(function (response) {
        if (response.ok) {
            document.getElementById(id + "C").className = "container-fluid bg-success";
            console.log("Refusal complete");
        } else console.log("Refusal failed");
    }).catch(function (error) {
        console.log("Refusal failed (Cannot process request)");
        console.error(error);
    });
}

function download(id){
    fetch('/request/download/' + id).then(function (response) {
        if (response.ok) {
            response.blob().then(function (blob) {
                let link = document.createElement('a');
                link.setAttribute('href', URL.createObjectURL(blob));
                link.setAttribute('download', "app");
                link.setAttribute('type', "hidden");
                link.click();
                console.log("Download complete");
            });
        } else console.log("Download failed");
    }).catch(function (error) {
        console.log("Download failed (Cannot process request)");
        console.error(error);
    });
}

requestList.keys().forEach(function (id) {
    document.getElementById(id+"V").addEventListener("click", function() {
        accept(id);
    });
    document.getElementById(id+"R").addEventListener("click", function() {
        refuse(id);
    });
    document.getElementById(id+"D").addEventListener("click", function() {
        download(id);
    });
});