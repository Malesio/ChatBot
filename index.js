const express = require("express");

const adminPort = process.env["CHATBOT_ADMIN_PORT"] || 7777;
const interfacePort = process.env["CHATBOT_INTERFACE_PORT"] || 3000;

const adminApp = express();
const interfaceApp = express();

adminApp.get("/", async (req, res) => {
    res.status(200).send({message: "Admin interface running"});
});

interfaceApp.get("/", async (req, res) => {
    res.status(200).send({message: "Chat interface running"});
});

adminApp.listen(adminPort, () => {
    console.log(`Admin interface listening on port ${adminPort}`);
});

interfaceApp.listen(interfacePort, () => {
    console.log(`Chat interface listening on port ${interfacePort}`);
});
