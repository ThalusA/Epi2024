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
    getRequestList().forEach(function (request) {
        requestList_object[request.id] = request;
    });
    var json = JSON.parse(req.body.data);
    let id = json.id;
    if (requestList_object[req.body.data.id]) {
        res.send({
            text: requestList_object[req.body.data.id].data,
            name: requestList_object[req.body.data.id].name + requestList_object[req.body.data.id].extension
        });
    } else res.send(0);
};