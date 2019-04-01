import discord
import json
import os
import sys
config = json.load(open("config.json"))

prefix = config["prefix"]
client = discord.Client()
global Modules
Modules = {}



@client.event
async def on_ready():
    print(f"Logged in as {client.user.display_name}!")
    reloadModules = __import__('reloadModules').reloadModules
    Modules["reloadModules"] = reloadModules.__dict__["reloadModules"]
    exec("Modules['reloadModules']")

@client.event
async def on_message(message):
    if message.content.startswith(prefix):
        message_content = message.content[len(prefix):]
        tmp = message_content.split(' ', 1)
        if tmp[0] in Modules and not (False in [True for perm in Modules[tmp[0]].permission.lower() if message.author.server_permissions[perm]]):
            try:
                await eval(f"{tmp[0]}(message, tmp[1])")
            except Exception as fail:
                await message.reply(":warning: error executing the function !")
                print(fail)

client.run(config["token"])
