function getUserStatus(req) {
    if (req.query.adm == '2a23a48721f1ea526c620677f1c7f9d603188e8cfc57cb55939df4b7a8224828') {
        return true;
    } else {
        return false;
    }
}

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

function getRequestIds(requestList) {
    var requestIds = Array();
    for (var index = 0; index < requestList.length; index++) {
        requestIds.push(requestList[index].id);
    }
    return requestIds;
}

module.exports = (req, res, next) => {
    /* INIT VAR */
    var adminMode = getUserStatus(req);
    var requestList = getRequestList();
    var requestIds = getRequestIds(requestList);
    requestList.forEach(function (request) {
        requestList_object[request.id] = request;
    });
    /* RENDER ALL VAR */
    res.render('request', {
        title: "Epi2024 Bot - Requests",
        adminMode: adminMode,
        requestList: requestList,
        requestIds: requestIds
    });
};