const express = require("express");
import { Session } from "./session"
const session = require("express-session");

class MuehleGame {
    constructor() {
        this.app = express();
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
        req.session.session = new Session();
        res.json(req.session.session.currentState);
    }

    getCurrentState(req, res) {
        res.json(req.session.session.currentState);
    }

    async playMove(req, res) {

        let exitCode = await Session.playMove(req.session.session, req.body.Move);

        if (exitCode == 200) {
            res.status(200).json(req.session.session.currentState);
        } else if (exitCode == 201) {
            res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
        } else {
            res.status(500).json({ error: "Der Zug konnte nicht ausgeführt werden!" });
        }
    }
}

module.exports = new MuehleGame().app;
