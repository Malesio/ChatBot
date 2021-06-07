const fs = require("fs");
const express = require("express");
const cors = require("cors");
const Controller = require("./controller");
const router = express.Router();

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    optionsSuccessStatus: 200
}

Controller.init().then(controller => {    
    router.post("/", cors(corsOptions), async (req, res) => {
        try {
            await controller.createBot(req.body);
            res.status(201).send({message: "Chatbot created"});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.get("/", cors(corsOptions), async (req, res) => {
        res.status(200).send(await controller.getBots());
    });

    router.get("/:id", cors(corsOptions), async (req, res) => {
        try {
            const bot = await controller.getBot(req.params.id);
            if (bot) {
                res.status(200).send(bot);
            } else {
                res.status(404).send({error: `Could not find chatbot with id ${req.params.id}`});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.delete("/", cors(corsOptions), async (req, res) => {
        res.sendStatus(405);
    });

    router.delete("/:id", cors(corsOptions), async (req, res) => {
        try {
            if (await controller.deleteBot(req.params.id)) {
                res.sendStatus(204);
            } else {
                res.status(404).send({error: `Could not find chatbot with id ${req.params.id} to delete`});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.get("/brains", cors(corsOptions), async (req, res) => {
        const brains = fs.readdirSync(__dirname + "/../brains");
    
        res.status(200).send({brains: brains.map(b => b.slice(0, b.indexOf(".")))});
    });

    router.put("/:id/brain", cors(corsOptions), async (req, res) => {
        try {
            const bot = await controller.getBot(req.params.id);
            if (bot) {
                await controller.addBrain(bot.id, req.body.brain);
                res.sendStatus(204);
            } else {
                res.status(404).send({error: `Could not find chatbot with id ${req.params.id}`});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.put("/:id/interface/discord", cors(corsOptions), async (req, res) => {
        try {
            const bot = await controller.getBot(req.params.id);
            if (bot) {
                await controller.addDiscordInterface(bot.id);
                res.status(200).send({invite: "https://discord.com/api/oauth2/authorize?client_id=851432387618275370&permissions=3072&scope=bot"});
            } else {
                res.status(404).send({error: `Could not find chatbot with id ${req.params.id}`});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.delete("/:id/interface/discord", cors(corsOptions), async (req, res) => {
        try {
            const bot = await controller.getBot(req.params.id);
            if (bot) {
                await controller.deleteDiscordInterface(bot.id);
                res.sendStatus(204);
            } else {
                res.status(404).send({error: `Could not find chatbot with id ${req.params.id}`});
            }
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });
});

module.exports = router;