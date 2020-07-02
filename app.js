const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(3000, function () { console.log("express server started" ) });

app.use(express.static("public"));
const io = socket(server);
io.on("connection", function (socket) {
    console.log("Made socket connection");
});

const tmi = require('tmi.js');
const client = new tmi.client({
    identity: { username: 'runload', password: process.env.TWITCH_OAUTH },
    channels: [ 'runload']
});

client.on('message', function (target, context, msg, self) {
    console.log('onMessageHandler', context);
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === '!d20') {
        const num = rollDice(commandName);
        client.say(target, `You rolled a ${num}. Link: https://glitch.com/~twitch-chatbot`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
})

client.connect();

