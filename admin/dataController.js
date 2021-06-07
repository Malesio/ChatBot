require("dotenv").config();

const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const RiveScript = require("rivescript");

class DataController {
    constructor(db) {
        this.db = db;
        this.riveInstances = new Map();
    }

    async reloadRiveInstance(bot) {
        const rive = this.riveInstances.get(bot.id);
        await rive.loadFile(bot.brain.map(f => __dirname + `/../brains/${f}.rive`));
        rive.sortReplies();
    }

    async createRiveInstance(bot) {
        const rive = new RiveScript();
        this.riveInstances.set(bot.id, rive);

        await this.reloadRiveInstance(bot);
    }

    async deleteRiveInstance(botId) {
        this.riveInstances.delete(botId);
    }

    async getBotReply(botId, userName, message) {
        await this.loadUserData(botId, userName);

        const reply = await this.riveInstances.get(botId).reply(userName, message);

        await this.saveUserData(botId, userName);

        return reply;
    }

    async loadUserData(botId, userName) {
        const userData = this.db.get(`userdata.${userName}`).value();

        if (userData) {
            await this.riveInstances.get(botId).setUservars(userName, userData);
        }
    }

    async saveUserData(botId, userName) {
        const userVars = await this.riveInstances.get(botId).getUservars(userName);

        await this.db.set(`userdata.${userName}`, userVars).write();
    }

    static async init() {
        const adapter = new FileAsync(process.env["USERDATA_DB_FILE"]);
        const db = await low(adapter);

        await db.defaults({ userdata: {} }).write();

        const instance = new DataController(db);

        return instance;
    }
}

module.exports = DataController;