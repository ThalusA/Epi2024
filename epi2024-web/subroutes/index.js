function modulesList(cb) {
    fs.readdir('../modules', (err, files) => {
        if (err) throw err;
        cb(files.filter(function (f) {
            ext = f.substr(-3);
            return ((ext === ".js" || ext === ".py") && f != "__pycache__");
        }));
    });
}

function createJSON(modules, cb) {
    let count = 0;
    let dataString = {
        "New Module": {
            data: ""
        }
    };
    for (let i = 0; i < modules.length; i++)
        fs.readFile("../modules/" + modules[i], "utf8", (err, data) => {
            if (err) throw err;
            dataString[modules[i]] = {
                data: data
            };
            count++;
            if (count == modules.length) cb(dataString);
        });
}

module.exports = (req, res, next) => {
    modulesList((modules) => {
        createJSON(modules, (files) => {
            res.render('index', {
                title: "Epi2024 Bot - Home",
                modules: modules,
                previewFiles: JSON.stringify(files)
            });
        });
    });
};