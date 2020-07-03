const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(3000, function () { console.log("Express.js server started" ) });

app.use(express.static("public"));
const io = socket(server);
io.on("connection", function (socket) {
    console.log("Made socket connection");
});

const tmi = require('tmi.js');
const twitchChat = new tmi.client({
    identity: { username: 'runload', password: process.env.TWITCH_OAUTH },
    channels: [ 'runload']
});

twitchChat.on('message', function (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    var name = context['display-name']

    if (msg.startsWith("!p")) {
        var components = msg.split(" ")
        try {
            var data = {
                x: parseInt(components[1], 10),
                y: parseInt(components[2], 10),
                style: components[3],
                name: name
            }
            if (data.x > 0 && data.y > 0){
                io.emit("paint", data)
            }else{
                twitchChat.say("#runload", "I can't do that @" + name);
            }
        }catch(error){
            console.log("error emiting paint")
            twitchChat.say("#runload", "I can't do that @" + name);
        }
    }else if ( msg.startsWith("!clear") && context.mod){
        io.emit("clear")
        twitchChat.say(target, "Clearing canvas @" + name);
    }else if ( msg.startsWith("!setsize") && context.mod){
        var components = msg.split(" ")
        io.emit("setsize", {x: components[1], y: components[2]})
        twitchChat.say(target, "Changing canvas size @" + name);
    }
})

twitchChat.connect();

io.on("canvas error", function(data){
    twitchChat.say("#runload", "I can't do that @" + data.name);
})
