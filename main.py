import discord
import json
import os
import sys
from reloadModules import reloadModules

class discord_bot:
    def __init__(self):
        self.prefix = json.load(open("config.json"))["prefix"]
        self.Modules = {}
        self.Modules["reloadModules"] = reloadModules
        self.client = discord.Client()
        self.client.event(self.on_ready)
        self.client.event(self.on_message)
        self.client.run(json.load(open("config.json"))["token"])

    async def on_ready(self):
        print(f"Logged in as {self.client.user.display_name}!")
        await self.Modules["reloadModules"].function(self, None, None)

    async def on_message(self, message):  
        if message.content.startswith(self.prefix):
            message_content = message.content[len(self.prefix):]
            tmp = message_content.split(' ', 1)
            if len(tmp) == 1: tmp = [tmp[0], None]
            if tmp[0] in self.Modules and message.author.guild_permissions.is_superset(discord.Permissions(self.Modules[tmp[0]].permission)):
                try:
                    await self.Modules[tmp[0]].function(self, message, tmp[1])
                except Exception as fail:
                    await message.channel.send(":warning: error executing the function !")
                    print(fail)

Epi2024_bot = discord_bot()
