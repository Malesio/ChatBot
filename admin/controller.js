require("dotenv").config();

const Low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const Bot = require("../models/bot");

class ChatbotController {

    constructor(database) {
        this.db = database;
    }

    async createBot(botData) {
        const newId = this.db.get("next_id").value();
        botData.id = newId;

        const newBot = new Bot(botData);

        await this.db.get("bots").push(newBot).write();
        await this.db.set("next_id", newId + 1).write();
    }

    async getBots() {
        const bots = await this.db.get("bots");
        
        return bots.map(e => new Bot(e));
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