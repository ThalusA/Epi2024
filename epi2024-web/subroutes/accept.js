function getRequestList(cb) {
    let requestList = {};
    let count = 0;
    fs.readdir('../epi2024-web/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++)
            if (files[i] != "example.json")
                fs.readFile('../epi2024-web/modules/' + files[i], (err, data) => {
                    if (err) throw err;
                    requestList[json.id] = JSON.parse(data);
                    count++;
                    if (count == files.length) cb(requestList);
                });
            else {
                count++;
                if (count == files.length) cb(requestList);
            }
    });
}


module.exports = (req, res, next) => {
    getRequestList((requestList) => {
        let client = new net.Socket();
        if (requestList[req.params.id]) {
            fs.writeFile('../epi2024-web/modules/' + requestList[req.params.id].name + requestList[req.params.id].extension, requestList[req.params.id].assign({
                state: "Validated"
            }), function (err) {
                if (err) throw err;
                client.connect(8100, 'localhost', function () {
                    client.write(requestList[req.params.id].name + requestList[req.params.id].extension);
                    client.destroy();
                    return res.status(200).end();
                });
            });
        } else return res.status(400).end();
    });
    
};