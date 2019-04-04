class help:
	name = "help"
	category = "Misc"
	shownInHelp = "true"
	description = ""
	helpMessage = "List all available command of Python environment"
	permission = 0
	
	async def function(self, message, args):
		helpOutput = ""
		permission = ""
		if args:
			if self.Modules[args].permission != "":
				permission = f" ( Required Permission : {self.Modules[args].permission} )"
			helpOutput += f"{self.Modules[args].name}: {self.Modules[args].description}{permission}"
		else : 
			for mod in self.Modules:
				if (mod.name != "baseModule" and mod.shownInHelp == "true"):
					if (mod.permission):
						permission = f' ( Required Permission: {mod.permission} )'
					helpOutput += f'{mod.name} : {mod.helpMessage}{permission}\n'
		self.client.send_message(message.channel, '```'+helpOutput+'```')
