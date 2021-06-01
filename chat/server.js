const express = require("express");

const app = express();
const port = process.env["CHATBOT_INTERFACE_PORT"] || 3000;
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

app.get("/", async (req, res) => {
    res.status(200).send({message: "Chat interface running"});
});

app.post("/:id", async(req, res) => {
    res.status(200).send({message: req.body.msg});
});

app.get("/bot/:id", async(req, res) => {
    res.status(200).render("botChat", {botId: req.params.id});
})

module.exports = () => {
    app.listen(port, () => {
        console.log(`Chat interface listening on port ${port}`);
    });
}