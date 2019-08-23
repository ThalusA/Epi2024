function getUserStatus(adm, cb) {
    if (adm == '2a23a48721f1ea526c620677f1c7f9d603188e8cfc57cb55939df4b7a8224828') cb(true);
    else cb(false);
}

function getRequestList(cb) {
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
                    if (count == files.length) cb(requestList);
                });
    });
}

module.exports = (req, res, next) => {
    getUserStatus(req.query.adm, (bool) => {
        getRequestList((requestList) => {
            res.render('request', {
                title: "Epi2024 Bot - Requests",
                adminMode: bool,
                requestList: requestList.values(),
                requestIds: requestList.keys()
            });
        });
    });
};