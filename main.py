import discord
import json
import os 
import sys
import socket
import threading
from reloadModules import reloadModules



class server_init(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)
    
    def run(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind(('localhost', 8101))
        self.sock.listen(1)

        while (True):
            connection, _ = self.sock.accept()
            del _
            try:
                if(connection.recv(1)):
                    reloadModules.function(self, None, None)
            finally:
                connection.close()

class discord_bot:
    def __init__(self):
        self.prefix = json.load(open("config.json"))["prefix"]
        self.Modules = {}
        self.Modules["reloadModules"] = __import__("reloadModules", fromlist=["reloadModules"])
        self.client = discord.Client()
        self.client.event(self.on_ready)
        self.client.event(self.on_message)
        self.client.run(json.load(open("config.json"))["token"])

    async def on_ready(self):
        print(f"Logged in as {self.client.user.display_name}!")
        await getattr(self.Modules["reloadModules"], "reloadModules").function(self, None, None)

    async def on_message(self, message):  
        if message.content.startswith(self.prefix):
            message_content = message.content[len(self.prefix):]
            tmp = message_content.split(' ', 1)
            if len(tmp) == 1: tmp = [tmp[0], None]
            if tmp[0] in self.Modules and message.author.guild_permissions.is_superset(discord.Permissions(getattr(self.Modules[tmp[0]], tmp[0]).permission)):
                try:
                    await getattr(self.Modules[tmp[0]], tmp[0]).function(self, message, tmp[1])
                except Exception as fail:
                    await message.channel.send(":warning: error executing the function !")
                    print(fail)

Epi2024_bot = discord_bot()
server = server_init()
server.start()
