function accept(id){
    $.ajax(this.href, {
        method: "POST",
        dataType: "json",
        data: {
            data: JSON.stringify({
                type: "accept",
                id: id
            })
        },
        error: function (err) {
            console.log("Approval failed (Cannot process request)");
            console.log(err);
        },
        success: function (data) {
            if (data) {
                document.getElementById(id + "C").className = "container-fluid bg-success";
                console.log("Approval complete");
            } else {
                console.log("Approval failed");
            }
        }
    });
}

function refuse(id){
    $.ajax(this.href, {
        method: "POST",
        dataType: "json",
        data: {
            data: JSON.stringify({
                type: "refuse",
                id: id
            })
        },
        error: function (err) {
            console.log("Refusal failed (Cannot process request)");
            console.log(err);
        },
        success: function (data) {
            if (data) {
                document.getElementById(id + "C").className = "container-fluid bg-danger";
                console.log("Refusal complete");
            } else {
                console.log("Refusal failed");
            }
        }
    });
}

function download(id){
    $.ajax(this.href, {
        method: "POST",
        dataType: "json",
        data: {
            data: JSON.stringify({
                type: "download",
                id: id
            })
        },
        error: function (err) {
            console.log("Download failed (Cannot process request)");
            console.log(err);
        },
        success: function (data) {
            if (data) {
                var link = document.createElement('a');
                link.setAttribute('href', URL.createObjectURL(new Blob([data.text], {type: 'text/plain'})));
                link.setAttribute('download', data.name);
                link.click();
                console.log("Download complete");
            } else {
                console.log("Download failed");
            }
        }
    });
}

requestList.forEach(function (id) {
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