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

function validate(response, res, next){
  var docker = new Docker();
  var random_key = Math.random().toString(); 
  var config = Array(3);
  
  if (response.env == "node") {
    config[0] = response.data + "\nconsole.log("+random_key+")";
    config[1] = '/docker/node/package.json';
    config[2] = requirement_js(response.data);
  } else if (response.env == "python3"){
    config[0] = response.data + "\nprint("+random_key+")";
    config[1] = '/docker/python3/requirements.txt';
    config[2] = requirement_py(response.data);
  }

  fs.writeFile(config[1], config[2], function(){
    fs.writeFile('/docker/'+response.env+'/app'+response.ext, config[0], function(){
      docker.command('build -t '+response.env+'_img ./docker/'+response.env+'/').then(function (){
        docker.command('run -p 4000:80 ./docker/'+response.env+'/'+response.env+'_img').then(function (){
          docker.command('logs ./docker/'+response.env+'/'+response.env+'_img').then(function (data){
            if (data.includes(random_key)){
              res.send(1);
            } else {
              res.send(data);
            }
          });
        });
      });
    });
  });
}

function submit(response, res, next){
  fs.writeFile('/modules/'+response.name+'.json', JSON.stringify(response), function (err){
    if (err) {res.send(0);} else {res.send(1);}
  });
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
  var json = JSON.parse(req.body.data);
  if (json.type == "validate") {
    validate(json.moduleinf, res, next);
  } else if (json.type == "submit") {
    submit(json.moduleinf, res, next);
  }
});

module.exports = router;
