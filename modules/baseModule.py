class baseModule:
	name = "baseModule"
	category = "Misc"
	shownInHelp = "false"
	description = ""
	helpMessage = ""
	permission = ""
	
	def __init__(self, client, message):
		self.client = client
		self.message = message
	
	async def command(self):
		pass