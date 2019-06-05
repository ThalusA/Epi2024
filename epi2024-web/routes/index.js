var express = require('express');
var router = express.Router();
var fs = require('fs');
var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;

/* FUNCTION */
function modulesList() {
  var result = Array();
  var files = fs.readdirSync('../modules');
  files = files.filter(function (f) {
    ext = f.substr(-3); 
    return ((ext === ".js" || ext === ".py") && f != "__pycache__");
  });
  files.forEach(function(file) {
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

function requirement_js(data){
  var regex = new RegExp(/require\('([\w-]*)'\)/, 'gm');
  var requirements = {"main": "app.js", "dependencies":{}};
  var match;
  while ((match = regex.exec(data)) != null) {
    requirements.dependencies[match[1]] = "latest";
  }
  return JSON.stringify(requirements);
}

function requirement_py(data){
  var regex = new RegExp(/(from\s+([\w-]+)\s+import\s+[\w-]+|import\s+([\w-]+))/, 'gm');
  var requirements = "";
  var match;
  while ((match = regex.exec(data) != null)) {
    if (match[3] == null) {
      requirements += (match[2]+"\n");
    } else {
      requirements += (match[3]+"\n");
    }
  }
  return requirements;
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

router.post('/', function(req, res, next){
  var response = req.body;
  var options = new DockerOptions('machine_'+response.env, '/docker/'+response.env);
  var docker = new Docker(options);
  fs.writeFileSync('/docker/'+response.env+'/app'+response.ext, response.data);
  if (response.env == "node") {
    fs.writeFileSync('/docker/node/package.json', requirement_js(response.data));
  } else if (response.env == "python3") {
    fs.writeFileSync('/docker/python3/requirements.txt', requirement_py(response.data));
  }
  docker.command('build -t env_img .').then(function (data){
    docker.command('run --name '+response.env+' -d -p 8000:8000 env_img ').then(function (data_r){
      
    });
  });
});

module.exports = router;
