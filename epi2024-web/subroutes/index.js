function modulesList() {
    let result = Array();
    fs.readdir('../modules', (err, files) => {
        if (err) throw err;
        result.concat(files.filter(function (f) {
            ext = f.substr(-3);
            return ((ext === ".js" || ext === ".py") && f != "__pycache__");
        }));
    });
    return result;
}

function createJSON(modules) {
    let dataString = {
        "New Module": {
            data: ""
        }
    };
    for (let i = 0; i < modules.length; i++)
        fs.readFile("../modules/" + modules[i], (err, data) => {
            if (err) throw err;
            else dataString[modules[idx]] = {
                data: JSON.parse(data)
            };
        });
    return JSON.stringify(dataString);
}

module.exports = (req, res, next) => {
    const modules = modulesList();
    const previewFiles = createJSON(modules);
    /* RENDER ALL VAR */
    res.render('index', {
        title: "Epi2024 Bot - Home",
        modules: modules,
        previewFiles: previewFiles
    });
};