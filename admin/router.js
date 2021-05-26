const express = require("express");
const Controller = require("./controller");
const router = express.Router();

Controller.init().then(controller => {    
    router.post("/", async (req, res) => {
        await controller.createBot({name: "Steeve", brain: "standard"});
        res.status(201).send({message: "Chatbot created"});
    });

    router.get("/", async (req, res) => {
        res.status(200).send([]);
    });

    router.get("/:id", async (req, res) => {
        res.status(404).send({error: "No chatbot yet"});
    });

    router.delete("/", async (req, res) => {
        res.sendStatus(405);
    });

    router.delete("/:id", async (req, res) => {
        res.status(404).send({error: "No corresponding chatbot"});
    });
});

module.exports = router;