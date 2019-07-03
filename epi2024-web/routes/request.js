var express = require('express');
var router = express.Router();
var fs = require('fs');
var requestList_object = null;
var net = require('net');
var client_py = new net.Socket();
var client_js = new net.Socket();

function getUserStatus(req) {
  if (req.query.adm == '2a23a48721f1ea526c620677f1c7f9d603188e8cfc57cb55939df4b7a8224828') {
    return true;
  } else {
    return false;
  }
}

function getRequestList() {
  var requestList = Array();
  var i = 0;
  fs.readdir('/modules', function (err, files){
    files.forEach( function (file, index, array) {
      i++;
      if (file == "example.json") return;
      requestList.push(JSON.parse(fs.readFileSync('/modules/' + file)));
      if(i == array.length){
        requestList = requestList.sort(function (a, b){return b.date - a.date;});
      }
    });
  });
  return requestList;
}

function getRequestIds(requestList){
  var requestIds = Array();
  for (var index = 0; index < requestList.length; index++) {
    requestIds.push(requestList[index].id);
  }
  return requestIds;
}

function refuse(id, res, next){
  if (requestList_object[id]) {
    requestList_object[id].assign({
      state: "Refused"
    });
    fs.writeFile('/modules/' + requestList_object[id].name + requestList_object[id].extension, requestList_object[id], function (err){
      if (err) res.send(0);
      else res.send(1);
    });
  } else res.send(0);
} 

function accept(id, res, next) {
  if (requestList_object[id]) {
    requestList_object[id].assign({
      state: "Validated"
    });
    fs.writeFile('/modules/' + requestList_object[id].name + requestList_object[id].extension, requestList_object[id], function (err){
      if (err) res.send(0);
      else {
        fs.writeFile("../modules/" + requestList_object[id].name + requestList_object[id].extension, requestList_object[id], function (err){
          if (err) {
            client_js.connect(8100, 'localhost', function () {
              client_js.write(1);
              client_py.connect(8101, 'localhost', function () {
                client_py.write(1);
                res.send(0);
              });
            });
          }
          else res.send(1);
        });
      } 
    });
  } else res.send(0);
}

function download(id, res, next) {
  if (requestList_object[id]) {
    res.send({
      text: requestList_object[id].data,
      name: requestList_object[id].name + requestList_object[id].extension
    });
  } else res.send(0);
}

/* GET request listing. */
router.get('/', function(req, res, next) {
  /* INIT VAR */
  var adminMode = getUserStatus(req);
  var requestList = getRequestList();
  var requestIds = getRequestIds(requestList);
  requestList.forEach(function (request) {
    requestList_object[request.id] = request;
  });
  /* RENDER ALL VAR */
  res.render('request', {
    title: "Epi2024 Bot - Requests",
    adminMode: adminMode,
    requestList: requestList,
    requestIds: requestIds
  });
});

router.post('/', function (req, res, next) {
  var json = JSON.parse(req.body.data);
  if (json.type == "refuse") {
    refuse(json.id, res, next);
  } else if (json.type == "accept") {
    accept(json.id, res, next);
  } else if (json.type == "download") {
    download(json.id, res, next);
  }
});

module.exports = router;
