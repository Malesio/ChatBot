const express = require("express");
const router = require("./router");

require("dotenv").config();

const app = express();
const port = process.env["CHATBOT_ADMIN_PORT"] || 7777;

app.use(express.json());
app.use("/chatbot", router);

app.get("/", async (req, res) => {
    res.status(200).send({message: "Admin interface running"});
});

module.exports = () => {
    app.listen(port, () => {
        console.log(`Admin interface listening on port ${port}`);
    })
}