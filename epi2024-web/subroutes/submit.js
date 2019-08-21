function modulesList() {
    let result = Array();
    fs.readdir('../modules', (err, files) => {
        if (err) throw err;
        let files_filter = files.filter(function (f) {
            ext = f.substr(-3);
            return ((ext === ".js" || ext === ".py") && f != "__pycache__");
        });
        for (let i = 0; i < files_filter.length; i++)
            result.push(file);
    });
    return result;
}

module.exports = (req, res, next) => {
    let name = response.name;
    if (modulesList().includes(name)) name += ("_" + md5(req.body.date));
    fs.writeFile('/modules/' + name + '.json', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        res.status(200).end();
    });
};