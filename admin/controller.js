require("dotenv").config();

const Low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const Bot = require("../models/bot");
const fs = require("fs");
const DiscordBot = require("./discord/bot");
const DataController = require("./dataController");

class ChatbotController {

    constructor(database, dataController) {
        this.db = database;
        this.dataController = dataController;

        this.discordClient = new DiscordBot(dataController);
        this.discordClient.run();
    }

    async createBot(botData) {
        if (!botData) {
            throw new Error("Missing bot data");
        }

        if (!botData.name) {
            throw new Error("Missing bot name");
        }

        const newId = this.db.get("next_id").value();
        botData.id = newId;

        const newBot = new Bot(botData);
        
        await this.dataController.createRiveInstance(newBot);

        await this.db.get("bots").push(newBot).write();
        await this.db.set("next_id", newId + 1).write();
    }

    async getBots() {
        return this.db.get("bots").value();
    }

    async getBot(botId) {
        botId = parseInt(botId, 10);
        if (isNaN(botId)) {
            throw new Error("Invalid bot ID");
        }

        return this.db.get("bots").find({id: botId}).value();
    }

    async deleteBot(botId) {
        const bot = await this.getBot(botId);
        if (bot) {
            await this.db.get("bots").remove({id: bot.id}).write();
            await this.dataController.deleteRiveInstance(bot.id);

            return true;
        }

        return false;
    }

    async addBrain(botId, brain) {
        if (!brain) {
            throw new Error("No brain specified");
        }

        const availableBrains = fs.readdirSync(__dirname + "/../brains").map(b => b.slice(0, b.indexOf(".")));

        if (!availableBrains.includes(brain)) {
            throw new Error(`Brain ${brain} not found in brain library`);
        }

        const bot = await this.getBot(botId);
        const brains = bot.brain;

        if (brains.includes(brain)) {
            throw new Error(`Bot already has ${brain} brain`);
        }

        await brains.push(brain).write();
        await this.dataController.reloadRiveInstance(bot);
    }

    async addDiscordInterface(botId) {
        const bot = await this.getBot(botId);
        const interfaces = bot.interface;

        if (interfaces.includes("discord")) {
            throw new Error("Bot already has a Discord interface");
        }

        const bots = await this.getBots();
        bots.forEach(b => {
            if (b.interface.includes("discord")) {
                throw new Error(`Discord interface already used by ${b.name}`);
            }
        });

        this.discordClient.activeBot = bot.id;

        await this.db.get("bots").find({id: bot.id}).get("interface").push("discord").write();
    }

    async deleteDiscordInterface(botId) {
        const bot = await this.getBot(botId);
        const interfaces = bot.interface;

        if (!interfaces.includes("discord")) {
            throw new Error("Bot does not have a Discord interface");
        }

        this.discordClient.activeBot = -1;

        await this.db.get("bots").find({id: bot.id}).get("interface").pull("discord").write();
    }

    async postMessage(botId, userName, message) {
        const bot = await this.getBot(botId);
        return await this.dataController.getBotReply(bot.id, userName, message);
    }

    static async init() {
        const adapter = new FileAsync(process.env["BOTS_DB_FILE"]);
        const db = await Low(adapter);

        await db.defaults({ bots: [], next_id: 0 }).write();

        const dataController = await DataController.init();
        const instance = new ChatbotController(db, dataController);

        const bots = await instance.getBots();
        await Promise.all(bots.map(async (bot) => {
            await dataController.createRiveInstance(bot);
            if (bot.interface.includes("discord")) {
                instance.discordClient.activeBot = bot.id;
            }
        }));

        return instance;
    }
};

module.exports = ChatbotController;