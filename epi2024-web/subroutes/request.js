function getUserStatus(req) {
    if (req.query.adm == '2a23a48721f1ea526c620677f1c7f9d603188e8cfc57cb55939df4b7a8224828') return true;
    else return false;
}

function getRequestList() {
    let requestList = {};
    fs.readdir('/modules', function (err, files) {
        if (err) throw err;
        for (let i = 0; i < files.length; i++)
            if (files[i] != "example.json")
                fs.readFile("/modules/" + files[i], (err, data) => {
                    if (err) throw err;
                    requestList[json.id] = JSON.parse(data);
                });
    });
    return requestList;
}

module.exports = (req, res, next) => {
    /* INIT VAR */
    var adminMode = getUserStatus(req);
    var requestList = getRequestList();
    /* RENDER ALL VAR */
    res.render('request', {
        title: "Epi2024 Bot - Requests",
        adminMode: adminMode,
        requestList: requestList.values(),
        requestIds: requestList.keys()
    });
};