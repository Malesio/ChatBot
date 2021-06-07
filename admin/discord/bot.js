const Discord = require("discord.js");

require("dotenv").config();

class Client {
    constructor(dataController) {
        this.dataController = dataController;

        this.client = new Discord.Client();
        this.prefix = process.env["DISCORD_BOT_PREFIX"];
        this.client.on("message", Client.prototype.gotMessage);
        this.activeBot = -1;
    }

    gotMessage(message) {
        if (message.content.startsWith(this.prefix) && !message.author.bot && this.activeBot !== -1) {
            const userMessage = message.content.slice(this.prefix.length);
            // TODO: submit the user's message to Rivescript
            this.dataController.getBotReply(this.activeBot, message.author.username, userMessage)
                .then(message.channel.send);
        }
    }

    run() {
        this.client.login(process.env["DISCORD_BOT_TOKEN"]);
    }
}

module.exports = Client;