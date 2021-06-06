const express = require("express");
const Controller = require("./controller");
const router = express.Router();

Controller.init().then(controller => {    
    router.post("/", async (req, res) => {
        try {
            await controller.createBot(req.body);
            res.status(201).send({message: "Chatbot created"});
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    });

    router.get("/", async (req, res) => {
        res.status(200).send(await controller.getBots());
    });

    router.get("/:id", async (req, res) => {
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

    router.delete("/", async (req, res) => {
        res.sendStatus(405);
    });

    router.delete("/:id", async (req, res) => {
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
});

module.exports = router;