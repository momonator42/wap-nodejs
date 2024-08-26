const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filePath = path.join(__dirname, "../init-gameState.json");

let currentState = JSON.parse(fs.readFileSync(filePath, "utf-8"));

let storedMove = null;

app.get("/api", (req, res) => {
    res.json(currentState);
});

app.post("/api/play", async (req, res) => {

    let payload = null;

    const move = {
        x: parseInt(req.body.Move.x, 10),
        y: parseInt(req.body.Move.y, 10),
        ring: parseInt(req.body.Move.ring, 10)
    };

    if (currentState.type == "MovingState" || currentState.type == "FlyingState") {
        if (!storedMove) {
            storedMove = move;
            return res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
        } else {
            payload = {
                Move: storedMove,
                Shift: move,
                State: currentState
            }
            storedMove = null;
        }
    } else {
        payload = {
            Move: move,
            State: currentState
        };
    }

    try {
        const response = await axios.post("http://localhost:9000", payload);
        
        currentState = response.data;

        res.json(currentState);
    } catch (error) {
        console.error("Error forwarding the request:", error);
        storedMove = null;
        res.status(500).json({ error: "Der Zug konnte nicht ausgeführt werden!" });
    }
});

app.post("/api/newGame", (req, res) => {
    currentState = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(currentState);
});

module.exports = app;
