function modulesList(cb) {
    fs.readdir('../epi2024-web/modules', (err, files) => {
        if (err) throw err;
        cb(files.filter(function (f) {
            ext = f.substr(-3);
            return ((ext === ".js" || ext === ".py") && f != "__pycache__");
        }));
    });
}

module.exports = (req, res, next) => {
    modulesList((modules) => {
        let name = response.name;
        if (modules.includes(name)) name += ("-" + md5(req.body.date));
        fs.writeFile('../epi2024-web/modules/' + name + '.json', JSON.stringify(req.body), function (err) {
            if (err) throw err;
            return res.status(200).end();
        });
    });  
};