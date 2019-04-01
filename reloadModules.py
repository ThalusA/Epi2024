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
    
    def __init__(self, client):
        self.client = client
        self.message = message

    async def reloadModules(self):
        files = os.listdir('./modules')
        sys.path.append('./modules')
        for module in files:
            if module.endswith('.py'):
                fmodule = module[:-3]
                exec(f"globals({fmodule}) = __import__({fmodule}).{fmodule}")
                funcs = [x for x, y in eval(f'{fmodule}.__dict__.items()') if type(y) == FunctionType]
                Modules[fmodule] = funcs
