const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const reloadModules = require('./reloadModules.js');
const strsplit = require('strsplit');
const net = require('net');
const fs = require('fs');
const communication = net.Socket();

var server = net.createServer(function (socket){
    socket.on("data", (data) => {
        fs.readFile("/epi2024-web/modules/" + data, (err, module) => {
            if (err) throw err;
            let json = JSON.parse(module);
            fs.writeFile("/modules/" + json.name, module, (err) => {
                if (err) throw err;
                communication.connect(8101, 'localhost', function () {
                    reloadModules.func();
                });
            });
        });
    });
});

server.listen(8100, 'localhost');

const prefix = config.prefix;
global.Modules = [];
Modules.reloadModules = reloadModules;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Use this Prefix --> ${prefix}`);
    reloadModules.func();
});

client.on('message', message => {
    if (message.content.startsWith(prefix)){
        message_content = message.content.slice(prefix.length);
        tmp = strsplit(message_content, ' ', 2);
        if (Modules[tmp[0]] && message.member.hasPermission(Modules[tmp[0]].permission)) {
            try {
                Modules[tmp[0]].func(message, tmp[1]);
            } catch (e) {
                message.channel.send(":warning: error executing the function !");
                console.log(e);
            }
        }

    }
});

client.login(config.token);