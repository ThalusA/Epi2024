function getRequestList() {
    let requestList = {};
    let count = 0;
    fs.readdir('/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++)
            if (files[i] != "example.json")
                fs.readFile("/modules/" + files[i], (err, data) => {
                    if (err) throw err;
                    requestList[json.id] = JSON.parse(data);
                    count++;
                    if (count == files.length) return requestList;
                });
    });
}

module.exports = (req, res, next) => {
    let requestList = getRequestList();
    if (requestList[req.params.id]) {
        requestList[req.params.id].assign({
            state: "Refused"
        });
        fs.writeFile('/modules/' + requestList[req.params.id].name + requestList[req.params.id].extension, requestList[req.params.id], function (err) {
            if (err) throw err;
            return res.status(200).end();
        });
    } else return res.status(400).end();
};