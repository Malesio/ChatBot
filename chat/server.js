const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env["CHATBOT_INTERFACE_PORT"] || 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/view'));
app.use(express.static(__dirname+'/public'));
app.use(express.json());

app.get("/", async (req, res) => {
    const list = await axios.get("http://localhost:7777/chatbot");
    res.status(200).render("index", {botList: list.data});
});

app.post("/bot/:id", async(req, res) => {
    res.status(200).send({msg: req.body.msg});
});

app.get("/bot/:id", async(req, res) => {
    res.status(200).render("botChat", {botId: req.params.id});
})

module.exports = () => {
    app.listen(port, () => {
        console.log(`Chat interface listening on port ${port}`);
    });
}