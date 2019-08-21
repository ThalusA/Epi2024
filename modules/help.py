class help:

	name = "help"
	category = "Misc"
	shownInHelp = True
	description = ""
	helpMessage = "List all available command of Python environment"
	permission = 0
	
	async def function(self, message, args):
		helpOutput = ""
		permissions = ""
		if args:
			if getattr(self.Modules[args], args).permission != "":
				permissions = f" ( Required Permission : {getattr(self.Modules[args], args).permission} )"
			helpOutput += f"{self.Modules[args].__name__}: {getattr(self.Modules[args], args).description}{permissions}"
		else : 
			for module_name in self.Modules:
				mod = self.Modules[module_name]
				if (mod.__name__ != "baseModule" and getattr(mod, mod.__name__).shownInHelp == True):
					if (getattr(mod, mod.__name__).permission):
						permissions = f' ( Required Permission: {getattr(mod, mod.__name__).permission} )'
					helpOutput += f'{mod.__name__} : {getattr(mod, mod.__name__).helpMessage}{permissions}\n'
		await message.channel.send('```'+helpOutput+'```')
