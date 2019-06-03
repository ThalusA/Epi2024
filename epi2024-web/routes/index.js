var express = require('express');
var router = express.Router();
var fs = require('fs');

/* FUNCTION */
function modulesList() {
  var result = Array();
  var files = fs.readdirSync('../modules');
  files = files.filter(f => {
    ext = f.substr(-3); 
    return ((ext === ".js" || ext === ".py") && f != "__pycache__");
  });
  files.forEach(file => {
    result.push(file);
  });
  return result;
}

function createJSON(modules) {
  var dataString = {};
  dataString["New Module"] = {data : ""};
  for (var idx = 0; idx < modules.length; idx++) {
    dataString[modules[idx]] = {data: fs.readFileSync('../modules/'+modules[idx], {encoding: "utf8"})};
  }
  return JSON.stringify(dataString);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  /* INIT VAR */
  var modules = modulesList();
  var previewFiles = createJSON(modules);
  /* RENDER ALL VAR */
  res.render('index', {
    title: "Epi2024 Bot - Home",
    modules: modules,
    previewFiles: previewFiles
  });
});

module.exports = router;
