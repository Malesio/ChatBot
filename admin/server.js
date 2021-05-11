const express = require("express");

const app = express();
const port = process.env["CHATBOT_ADMIN_PORT"] || 7777;

app.get("/", async (req, res) => {
    res.status(200).send({message: "Admin interface running"});
});

module.exports = () => {
    app.listen(port, () => {
        console.log(`Admin interface listening on port ${port}`);
    })
}