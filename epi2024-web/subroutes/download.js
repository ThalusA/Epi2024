function getIdsList(cb) {
    let count = 0;
    let requestList = {};
    fs.readdir('../epi2024-web/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++) 
            if (files[i] != "example.json")
                fs.readFile('../epi2024-web/modules/' + files[i], (err, data) => {
                    if (err) throw err;
                    requestList[JSON.parse(data).id] = "'../epi2024-web/modules/'" + files[i];
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
    getIdsList((idList) => {
        if (idList[req.params.id]) return res.status(200).download(idList[req.params.id]).end();
        else return res.status(400).end();
    });
};