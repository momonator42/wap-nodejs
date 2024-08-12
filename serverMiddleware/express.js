const fs = require("fs");
const path = require("path");

const express = require("express");

const app = express();

const filePath = path.join(__dirname, "../init-gameState.json");

const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));


app.get("/api", (req, res) => {
    res.json(data);
});

module.exports = app;
