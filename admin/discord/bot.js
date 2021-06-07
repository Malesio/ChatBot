const Discord = require("discord.js");

require("dotenv").config();

class Client {
    constructor() {
        this.client = new Discord.Client();
        this.prefix = process.env["DISCORD_BOT_PREFIX"];
        this.client.on("message", Client.prototype.gotMessage);
    }

    gotMessage(message) {
        if (message.content.startsWith(this.prefix) && !message.author.bot) {
            const userMessage = message.content.slice(this.prefix.length);
            // TODO: submit the user's message to Rivescript
        }
    }

    run() {
        this.client.login(process.env["DISCORD_BOT_TOKEN"]);
    }
}

module.exports = Client;