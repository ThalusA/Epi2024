function getRequestList() {
    let requestList = {};
    fs.readdir('/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++)
            if (files[i] != "example.json")
                fs.readFile("/modules" + files[i], (err, data) => {
                    if (err) throw err;
                    let json = JSON.parse(data);
                    requestList[json.id] = json;
                });
    });
    return requestList;
}

module.exports = (req, res, next) => {
    let requestList = getRequestList();
    let pyclient = new net.Socket();
    let jsclient = new net.Socket();
    if (requestList[req.params.id]) {
        requestList[req.params.id].assign({
            state: "Validated"
        });
        fs.writeFile('/modules/' + requestList[req.params.id].name + requestList[req.params.id].extension, requestList[req.params.id], function (err) {
            if (err) throw err;
            jsclient.connect(8100, 'localhost', function () {
                jsclient.write(1);
                pyclient.connect(8101, 'localhost', function () {
                    pyclient.write(1);
                    return res.status(200).end();
                });
            });
        });
    } else return res.status(400).end();
};