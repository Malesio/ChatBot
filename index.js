const dotenv = require("dotenv");
const admin = require("./admin/server");
const chat = require("./chat/server");

dotenv.config();

admin();
chat();
