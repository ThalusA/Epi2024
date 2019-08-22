module.exports = {
  name:"help",
  category:"Misc",
  shownInHelp:"true",
  description:"",
  helpMessage: "List all available command of NodeJS environment",
  permission:0,
  func : function (message, args) {
    var helpOutput = "";
    var permission = "";
    if (args){
      if (Modules[args].permission != "") {
        permission = ` ( Required Permission : ${Modules[args].permission} )`;
      }
      helpOutput = `${Modules[args].name} : ${Modules[args].description}${permission}`;
    } else {
      let tmpModule = Object.assign({}, Modules);
      for (var module in tmpModule) {
        mod = tmpModule[module];
        if (mod.name != "baseModule" && mod.shownInHelp == "true") {
          if (mod.permission) {
            permission = ` ( Required Permission : ${mod.permission} )`;
          }
          helpOutput += `${mod.name} : ${mod.helpMessage}${permission}\n`;
        }
      }
    }
    message.channel.send('```'+helpOutput+'```');
  }
};
