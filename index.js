const express = require("express");
require("dotenv").config();
require("./database/config");
require("./model");
const router = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);

// listen
app.listen(PORT, () => console.log(`Server running at ${PORT}`));

// export app
module.exports = app;
