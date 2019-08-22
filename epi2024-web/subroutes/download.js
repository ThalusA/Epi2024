function getIdsList() {
    let requestList = {};
    fs.readdir('/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++) 
            if (files[i] != "example.json")
                fs.readFile("/modules/" + files[i], (err, data) => {
                    if (err) throw err;
                    requestList[JSON.parse(data).id] = "/modules/" + files[i];
                });
    });
    return requestList;
}

module.exports = (req, res, next) => {
    const idList = getIdsList();
    if (idList[req.params.id]) return res.status(200).download(idList[req.params.id]).end();
    else return res.status(400).end();
};