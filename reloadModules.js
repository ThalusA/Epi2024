const fs = require('fs');
module.exports = {
  name:"reloadModules",
  shownInHelp:"false",
  description:"",
  helpMessage:"",
  permission:0,
  func : function (msg, args) {
    if ((msg === undefined) || (msg.member.hasPermission('ADMINISTRATOR'))) {
      if (msg !== undefined){var react = msg.react("✅");}
      fs.readdirSync("./modules/").forEach(file => {
        if (file.slice(-3) === ".js"){
          ModuleName = file.slice(0, -3);
          if (Modules[ModuleName] && ModuleName != "reloadModules") {
            delete require.cache[require.resolve("./modules/" + ModuleName)];
            delete Modules[ModuleName];
            console.log("The module '"+ ModuleName + "' has been unloaded");
          }
          try {
            Modules[ModuleName] = require("./modules/" + ModuleName);
            console.log("The module '"+ ModuleName + "' has beeen loaded");
          } catch (e) {
            if (msg !== undefined) {
              react.remove(client.user);
              msg.react("❎");
            }   
            console.log("The module '" + ModuleName + "' failed to be loaded");
            console.warn(e);
          }
        }
      });
    }
  }
}
