var express = require('express');
var router = express.Router();
var fs = require('fs');

function getUserStatus(admFORCAGE) {
  if (admFORCAGE) {
    return true;
  } else {
    return false;
  }
}

function getRequestList() {
  var requestList = Array();
  var requests = fs.readdirSync('modules');
  requests.forEach((file) => {
    if (file == "example.json") return;
    requestList.push(JSON.parse(fs.readFileSync('/modules/' + file)));
  });
  requestList = requestList.sort(function (a, b){
    return b.id - a.id;
  });
  return requestList;
}

/* GET request listing. */
router.get('/', function(req, res, next) {
  /* INIT VAR */
  var admFORCAGE = true;
  var adminMode = getUserStatus(admFORCAGE);
  var requestList = getRequestList();
  /* RENDER ALL VAR*/
  res.render('request', {
    title: "Epi2024 Bot - Requests",
    adminMode: adminMode,
    requestList: requestList
  });
});

module.exports = router;
