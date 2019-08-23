function getUserStatus(adm, cb) {
    if (crypto.createHash("sha512").update(adm).digest("hex") == 'fb67c95cf4c8a94f1d560bcf04699c500c527bf95de846fa2853bcdcdf0557a670ba8ea5d209cdf84fed3b3dd7d3342c81632f301698dc0c4ba67e85af2c5270') cb(true);
    else cb(false);
}

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
                    if (count == files.length) cb(Object.values(requestList), JSON.stringify(Object.keys(requestList)));
                });
            else {
                count++;
                if (count == files.length) 
                cb(Object.values(requestList), JSON.stringify(Object.keys(requestList)));
            }
    });
}

module.exports = (req, res, next) => {
    getUserStatus(req.query.adm, (bool) => {
        getRequestList((values, keys) => {
            res.render('request', {
                title: "Epi2024 Bot - Requests",
                adminMode: bool,
                requestList: values,
                requestIds: keys
            });
        });
    });
};