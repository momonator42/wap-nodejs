const express = require("express");
import { GameState } from "./gameState";
import { Session } from "./session"
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

class MuehleGame {
    constructor() {
        this.redisClient;
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.redisClient = createClient({
            url:  process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false  // Akzeptiert selbstsignierte Zertifikate (ACHTUNG: Sicherheitsrisiko!)
            }
        });
        this.redisClient.connect().catch(console.error);
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: new RedisStore({
                client: this.redisClient,
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

    async newGame(req, res) {
        await Session.saveGameState(req.session.session, new GameState(), this.redisClient);
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der Session." });
            }
            res.json(gameState.currentState);
        });
    }

    async getCurrentState(req, res) {
        if (!req.session.session) {
            req.session.session = new Session();
            return await this.newGame(req, res)
        }
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);
        res.json(gameState.currentState);
    }

    async playMove(req, res) {

        let exitCode = await Session.playMove(req.session.session, this.redisClient, req.body.Move);
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);

        if (exitCode == 200) {
            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Session." });
                }
                res.status(200).json(gameState.currentState);
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
