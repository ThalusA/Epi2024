function modulesList() {
    fs.readdir('../modules', (err, files) => {
        if (err) throw err;
        return files.filter(function (f) {
            ext = f.substr(-3);
            return ((ext === ".js" || ext === ".py") && f != "__pycache__");
        });
    });
}

module.exports = (req, res, next) => {
    let name = response.name;
    if (modulesList().includes(name)) name += ("-" + md5(req.body.date));
    fs.writeFile('/modules/' + name + '.json', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        return res.status(200).end();
    });
};