const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const session = require("express-session");

class MuehleGame {
    constructor() {
        this.app = express();
        this.filePath = path.join(__dirname, "../init-gameState.json");
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            secret: 'keyboard cat',
            cookie: { maxAge: 300000 }
        }));
    }

    setupRoutes() {
        this.app.post("/api/newGame", (req, res) => this.newGame(req, res));
        this.app.get("/api", (req, res) => this.getCurrentState(req, res));
        this.app.post("/api/play", (req, res) => this.playMove(req, res));
    }

    newGame(req, res) {
        req.session.storedMove = null;
        req.session.currentState = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
        res.json(req.session.currentState);
    }

    getCurrentState(req, res) {
        res.json(req.session.currentState);
    }

    async playMove(req, res) {
        if (!req.session.currentState) {
            return res.status(400).json({ error: "Spielzustand ist nicht initialisiert. Starten Sie ein neues Spiel mit /api/newGame." });
        }

        let payload = null;

        const move = {
            x: parseInt(req.body.Move.x, 10),
            y: parseInt(req.body.Move.y, 10),
            ring: parseInt(req.body.Move.ring, 10)
        };

        if (req.session.currentState.type === "MovingState" || req.session.currentState.type === "FlyingState") {
            if (!req.session.storedMove) {
                req.session.storedMove = move;
                return res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
            } else {
                payload = {
                    Move: req.session.storedMove,
                    Shift: move,
                    State: req.session.currentState
                };
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
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`Server läuft auf Port ${port}`);
        });
    }
}

module.exports = new MuehleGame().app;
