from types import FunctionType
import os
import sys
class reloadModules:
    name = "reloadModules"
    category = "Misc"
    shownInHelp = False
    description = ""
    helpMessage = ""
    permission = 8

    async def function(self, message, args):
        if(message):
            await message.add_reaction("☑")
        sys.path.append('./modules')
        for module in os.listdir('./modules'):
            if module.endswith('.py'):
                fmodule = module[:-3]
                if (fmodule in self.Modules):
                    del self.Modules[fmodule]
                    print("The module '" + fmodule + "' has been unloaded.")
                try:
                    self.Modules[fmodule] = __import__(fmodule, fromlist=[fmodule])
                    print("The module '" + fmodule + "' has been loaded.")
                except Exception:
                    await message.remove_reaction("☑", self.client.user)
                    await message.add_reaction("❌")
                    print("The module" + fmodule + " failed to be loaded.")