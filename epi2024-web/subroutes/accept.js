function getRequestList() {
    var requestList = Array();
    var i = 0;
    fs.readdir('/modules', function (err, files) {
        files.forEach(function (file, index, array) {
            i++;
            if (file == "example.json") return;
            requestList.push(JSON.parse(fs.readFileSync('/modules/' + file)));
            if (i == array.length) {
                requestList = requestList.sort(function (a, b) {
                    return b.date - a.date;
                });
            }
        });
    });
    return requestList;
}

module.exports = (req, res, next) => {
    let requestList_object = {};
    var net = require('net');

    var client_py = new net.Socket();
    var client_js = new net.Socket();

    getRequestList().forEach(function (request) {
        requestList_object[request.id] = request;
    });
    var json = JSON.parse(req.body.data);
    let id = json.id;
    if (requestList_object[id]) {
        requestList_object[id].assign({
            state: "Validated"
        });
        fs.writeFile('/modules/' + requestList_object[id].name + requestList_object[id].extension, requestList_object[id], function (err) {
            if (err) res.send(0);
            else {
                fs.writeFile("../modules/" + requestList_object[id].name + requestList_object[id].extension, requestList_object[id], function (err) {
                    if (err) {
                        client_js.connect(8100, 'localhost', function () {
                            client_js.write(1);
                            client_py.connect(8101, 'localhost', function () {
                                client_py.write(1);
                                res.send(0);
                            });
                        });
                    } else res.send(1);
                });
            }
        });
    } else res.send(0);
};