const express = require("express");
import { Session } from "./session"
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

class MuehleGame {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        const redisClient = createClient({
            url:  process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false  // Akzeptiert selbstsignierte Zertifikate (ACHTUNG: Sicherheitsrisiko!)
            }
        });
        redisClient.connect().catch(console.error);
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: new RedisStore({
                client: redisClient,
                prefix: "session:",
                ttl: 300,
            }),
            secret: 'keyboard cat',
            cookie: { maxAge: 300000 },
            resave: true,
            saveUninitialized: false,
            rolling: true
        }));
    }

    setupRoutes() {
        this.app.post("/api/newGame", (req, res) => this.newGame(req, res));
        this.app.get("/api", (req, res) => this.getCurrentState(req, res));
        this.app.post("/api/play", (req, res) => this.playMove(req, res));
    }

    newGame(req, res) {
        req.session.session = new Session();
        req.session.session.currentState = req.session.session.currentState;
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der Session." });
            }
            res.json(req.session.session.currentState);
        });
    }

    getCurrentState(req, res) {
        if (!req.session.session) {
            return this.newGame(req, res)
        }
        res.json(req.session.session.currentState);
    }

    async playMove(req, res) {

        let exitCode = await Session.playMove(req.session.session, req.body.Move);

        if (exitCode == 200) {
            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Session." });
                }
                res.status(200).json(req.session.session.currentState);
            });
        } else if (exitCode == 201) {
            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Session." });
                }
                res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
            });
        } else {
            res.status(500).json({ error: "Der Zug konnte nicht ausgeführt werden!" });
        }
    }
}

module.exports = new MuehleGame().app;
