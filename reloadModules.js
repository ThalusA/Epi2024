const fs = require('fs');
module.exports = {
  name:"reloadModules",
  shownInHelp:"false",
  description:"",
  helpMessage:"",
  permission:"",
  func : function (msg, args) {
    if ((msg === undefined) || (msg.member.hasPermission('ADMINISTRATOR'))) {
      if (msg === !undefined){msg.react("✅");}
      fs.readdirSync("./modules/").forEach(file => {
        if (file.slice(-3) === ".js"){
          ModuleName = file.slice(0, -3);
          if (Modules[ModuleName] && ModuleName != "reloadModules") {
            delete require.cache[require.resolve("./modules/" + ModuleName)];
            delete Modules[ModuleName];
            console.log("Unloaded module ./modules/" + ModuleName);
          }
          try {
            Modules[ModuleName] = require("./modules/" + ModuleName);
            console.log("module ./modules/" + file + " is being loaded");
          } catch (e) {
            if (msg === !undefined) {
              msg.clearReactions();
              msg.react("❎");
            }
            console.log("module ./modules/" + ModuleName + " failed to be loaded");
            console.warn(e);
          }
        }
      });
    }
  }
}
