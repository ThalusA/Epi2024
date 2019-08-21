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


function createJSON(modules) {
    let dataString = {};
    dataString["New Module"] = {
        data: ""
    };
    fs.readFile("../modules/" + modules[idx], (err, data) => {
        if (err) throw err;
        else {
            for (let idx = 0; idx < modules.length; idx++)
                dataString[modules[idx]] = {
                    data: data
                };
            return JSON.stringify(dataString);
        }
    });
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