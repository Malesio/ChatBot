require("dotenv").config();

const Low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const Bot = require("../models/bot");

class ChatbotController {

    constructor(database) {
        this.db = database;
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
        botId = parseInt(botId, 10);
        if (isNaN(botId)) {
            throw new Error("Invalid bot ID");
        }

        const bots = this.db.get("bots");

        if (bots.find({id: botId}).value()) {
            await bots.remove({id: botId}).write();

            return true;
        }

        return false;
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