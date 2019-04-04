from types import FunctionType
import os
import sys
class reloadModules:
    name = "reloadModules"
    category = "Misc"
    shownInHelp = "false"
    description = ""
    helpMessage = ""
    permission = "ADMINISTRATOR"

    async def function(self, message, args):
        if(message): message.add_reaction(":ballot_box_with_check:")
        sys.path.append('./modules')
        for module in os.listdir('./modules'):
            if module.endswith('.py'):
                fmodule = module[:-3]
                if (fmodule in self.Modules):
                    del self.Modules[fmodule]
                    print("The module '", fmodule, "' has been unloaded.")
                try:
                    self.Modules[fmodule] = __import__(fmodule, fromlist=[fmodule])
                    print("The module '", fmodule, "' has been loaded.")
                except Exception:
                    message.remove_reaction(":ballot_box_with_check:", self.client.user)
                    message.add_reaction(":x:")
                    print("The module", fmodule, " failed to be loaded.")
                
