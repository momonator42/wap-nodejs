const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
var session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 300000 }}))


const filePath = path.join(__dirname, "../init-gameState.json");

app.post("/api/newGame", (req, res) => {
    req.session.storedMove = null
    req.session.currentState = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(req.session.currentState);
});

app.get("/api", (req, res) => {
    res.json(req.session.currentState);
});

app.post("/api/play", async (req, res) => {

    let payload = null;

    const move = {
        x: parseInt(req.body.Move.x, 10),
        y: parseInt(req.body.Move.y, 10),
        ring: parseInt(req.body.Move.ring, 10)
    };

    if (req.session.currentState.type == "MovingState" || req.session.currentState.type == "FlyingState") {
        if (!req.session.storedMove) {
            req.session.storedMove = move;
            return res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
        } else {
            payload = {
                Move: req.session.storedMove,
                Shift: move,
                State: req.session.currentState
            }
            req.session.storedMove = null;
        }
    } else {
        payload = {
            Move: move,
            State: req.session.currentState
        };
    }

    try {
        const response = await axios.post("https://wap-mill-212a87db8908.herokuapp.com", payload);
        
        req.session.currentState = response.data;

        res.json(req.session.currentState);
    } catch (error) {
        console.error("Error forwarding the request:", error);
        req.session.storedMove = null;
        res.status(500).json({ error: "Der Zug konnte nicht ausgeführt werden!" });
    }
});

module.exports = app;
