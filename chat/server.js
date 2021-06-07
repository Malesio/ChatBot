const express = require("express");
const axios = require("axios");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env["CHATBOT_INTERFACE_PORT"] || 3000;
const adminPort = process.env["CHATBOT_ADMIN_PORT"] || 7777;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/view'));
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/", async (req, res) => {
    const list = await axios.get(`http://localhost:${adminPort}/chatbot`);
    res.status(200).render("index", {botList: list.data});
});

app.post("/", async (req, res) => {
    res.cookie("login", req.body.login);
    res.redirect("/");
});

app.post("/bot/:id", async(req, res) => {
    const body = {
        username: req.body.login,
        message: req.body.msg
    };

    try {
        const reply = await axios.post(`http://localhost:${adminPort}/chatbot/${req.params.id}/message`, body);
        res.status(200).send({msg: reply.data.reply});
    } catch (e) {
        res.status(e.response.status).send({msg: `Backend server refused to process request: ${e.message}`});
    }
});

app.get("/bot/:id", async(req, res) => {
    if (!req.cookies.login) {
        res.redirect("/");
    }

    const name = await axios.get(`http://localhost:${adminPort}/chatbot/${req.params.id}`);
    res.status(200).render("botChat", {botId: req.params.id, botName: name.data.name, username: req.cookies.login});
})

module.exports = () => {
    app.listen(port, () => {
        console.log(`Chat interface listening on port ${port}`);
    });
}