const express = require("express");

const app = express();
const port = process.env["CHATBOT_INTERFACE_PORT"] || 3000;

app.get("/", async (req, res) => {
    res.status(200).send({message: "Chat interface running"});
});

app.post("/", async(req, res) => {
    res.status(200).send([]);
});

module.exports = () => {
    app.listen(port, () => {
        console.log(`Chat interface listening on port ${port}`);
    });
}