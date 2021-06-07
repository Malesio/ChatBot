require("dotenv").config();

const Low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const Bot = require("../models/bot");
const fs = require("fs");
const DiscordBot = require("./discord/bot");

class ChatbotController {

    constructor(database) {
        this.db = database;
        this.discordClient = new DiscordBot();
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

        await this.db.get("bots").push(newBot).write();
        await this.db.set("next_id", newId + 1).write();
    }

    async getBots() {
        return await this.db.get("bots").value();
    }

    async getBot(botId) {
        botId = parseInt(botId, 10);
        if (isNaN(botId)) {
            throw new Error("Invalid bot ID");
        }

        return this.db.get("bots").find({id: botId}).value();
    }

    async deleteBot(botId) {
        if (await this.getBot(botId)) {
            await this.db.get("bots").remove({id: botId}).write();

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

        const brains = (await this.getBot(botId)).brain;

        if (brains.includes(brain)) {
            throw new Error(`Bot already has ${brain} brain`);
        }

        await brains.push(brain).write();
    }

    async addDiscordInterface(botId) {
        const interfaces = (await this.getBot(botId)).interface;

        if (interfaces.includes("discord")) {
            throw new Error("Bot already has a Discord interface");
        }

        // TODO: allow bot to chat on discord

        await interfaces.push("discord").write();
    }

    async deleteDiscordInterface(botId) {
        const interfaces = (await this.getBot(botId)).interface;

        if (!interfaces.includes("discord")) {
            throw new Error("Bot does not have a Discord interface");
        }

        await interfaces.pull("discord").write();
    }

    static async init() {
        const adapter = new FileAsync(process.env["BOTS_DB_FILE"]);
        const db = await Low(adapter);

        await db.defaults({ bots: [], next_id: 0 }).write();

        const instance = new ChatbotController(db);

        return instance;
    }
};

module.exports = ChatbotController;