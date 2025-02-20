const express = require("express");
const http = require("http");
import { GameState } from "./gameState";
import { Session } from "./session";
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const Multiplayer = require("./multiplayer");  // Importiere die Multiplayer-Klasse

class MuehleGame {
    constructor() {
        this.redisClient;
        this.redisSubscriber;
        this.app = express();
        this.server = null;
        this.multiplayer = null;  // WebSocket-Handling
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.redisClient = createClient({
            url: process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false  // Akzeptiert selbstsignierte Zertifikate
            }
        });

        // Subscriber client for Pub/Sub
        this.redisSubscriber = createClient({
            url: process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false
            }
        });

        this.redisClient.on('error', (err) => {
            console.log("Server didn't crash!!!");
            console.error('Redis Client Error', err);
        });

        this.redisSubscriber.on('error', (err) => {
            console.error('Redis Subscriber Error', err);
        });

        this.redisClient.connect();
        this.redisSubscriber.connect();

        this.sessionStore = new RedisStore({
            client: this.redisClient,
            prefix: "session:",
            ttl: 300
        });

        // Handle incoming messages on subscribed channels
        this.redisSubscriber.subscribe('gameUpdates', (message) => {
            const parsedMessage = JSON.parse(message);

            this.multiplayer.notifyClients(parsedMessage.gameId, parsedMessage.message);
        });

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(session({
            store: this.sessionStore,
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
        this.app.post("/api/startMultiplayer", (req, res) => this.startMultiplayerGame(req, res));
        this.app.post("/api/joinMultiplayer", (req, res) => this.joinMultiplayerGame(req, res));
        this.app.post("/api/exitMultiplayer", (req, res) => this.exitMultiplayer(req, res));
        this.app.post("/webhook/redis", (req, res) => this.updateRedisUrl(req, res));
    }

    async updateRedisUrl(req, res) {
        try {
            console.log("Webhook triggered for release.");

            const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;
            const TARGET_APP_NAME = "wap-persistence";

            if (!HEROKU_API_TOKEN) {
                throw new Error("Heroku API token is missing in the environment.");
            }

            const fetch = require("node-fetch");

            const response = await fetch(
                `https://api.heroku.com/apps/${TARGET_APP_NAME}/config-vars`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${HEROKU_API_TOKEN}`,
                        Accept: "application/vnd.heroku+json; version=3",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch REDIS_URL: ${response.statusText}`);
            }

            const configVars = await response.json();
            const redisUrl = configVars.REDIS_URL;

            if (!redisUrl) {
                throw new Error("REDIS_URL is not defined in the target app.");
            }

            console.log(`Fetched updated Redis URL: ${redisUrl}`);
    
            if (this.redisClient && this.redisClient.isOpen) {
                await this.redisClient.disconnect();
            }
            if (this.redisSubscriber && this.redisSubscriber.isOpen) {
                await this.redisSubscriber.disconnect();
            }
    
            this.redisClient = createClient({
                url: redisUrl,
                socket: {
                    tls: true,
                    rejectUnauthorized: false
                }
            });
    
            this.redisSubscriber = createClient({
                url: redisUrl,
                socket: {
                    tls: true,
                    rejectUnauthorized: false
                }
            });
    
            this.redisClient.on("error", (err) => console.error("Redis Client Error", err));
            this.redisSubscriber.on("error", (err) => console.error("Redis Subscriber Error", err));
    
            await this.redisClient.connect();
            await this.redisSubscriber.connect();
    
            console.log("Redis clients updated successfully!");

            this.sessionStore.client = this.redisClient;
    
            res.status(200).json({ message: "Redis URL updated and clients reconnected successfully" });
        } catch (err) {
            console.error("Error updating Redis URL:", err);
            this.redisClient = null;
            this.redisSubscriber = null;
            res.status(500).json({ error: "Failed to update Redis URL" });
        }
    }
    

    setupWebSocketServer(server) {
        this.multiplayer = new Multiplayer(server);
    }

    async notifyClients(gameId, message) {
        if (this.multiplayer) {
            await this.redisClient.publish('gameUpdates', JSON.stringify({ gameId, message }));
        }
    }

    async startMultiplayerGame(req, res) {
        await Session.startMultiplayerGame(req.session.session, this.redisClient);
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Starten des Multiplayer-Spiels." });
            }
            res.json({ gameId: req.session.session.gameId });
        });
    }

    async joinMultiplayerGame(req, res) {
        const gameId = req.body.gameId;
        const result = await Session.joinMultiplayerGame(req.session.session, this.redisClient, gameId);
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Beitreten des Multiplayer-Spiels." });
            }
            res.json({ gameState: result });
        });
    }

    async exitMultiplayer(req, res) {
        const { oldGameId, result } = await Session.endMultiplayerGame(req.session.session, this.redisClient);
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Verlassen des Multiplayer-Spiels." });
            }
            res.json({ message: "Sitzung verlassen!", state: result, gameId: oldGameId});
        });
    }

    async newGame(req, res) {
        await Session.saveGameState(req.session.session, new GameState(), this.redisClient);
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);
        req.session.save(async err => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der Session." });
            }
            await this.notifyClients(req.session.session.gameId, gameState.currentState);
            res.json(gameState.currentState);
        });
    }

    async getCurrentState(req, res) {
        if (!req.session.session) {
            req.session.session = new Session();
            return await this.newGame(req, res);
        }
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);
        res.json(gameState.currentState);
    }

    async playMove(req, res) {
        let exitCode = await Session.playMove(req.session.session, this.redisClient, req.body.Move);
        const gameState = await Session.loadGameState(req.session.session, this.redisClient);

        if (exitCode == 200) {
            req.session.save(async (err) => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Session." });
                }
                await this.notifyClients(req.session.session.gameId, gameState.currentState);
                res.status(200).json(gameState.currentState);
            });
        } else if (exitCode == 201) {
            req.session.save(async (err) => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Session." });
                }
                await this.notifyClients(req.session.session.gameId, { message: "Move gespeichert, Shift erwartet." });
                res.status(200).json({ message: "Move gespeichert, Shift erwartet." });
            });
        } else if (exitCode == 401) {
            res.status(500).json({ error: "Du bist nicht dran!" });
        } else {
            res.status(500).json({ error: "Der Zug konnte nicht ausgeführt werden!" });
        }
    }
}

// Erstelle eine Instanz von MuehleGame
const muehleGame = new MuehleGame();

// Exportiere die Express-App
module.exports = muehleGame.app;

// Funktion, um den WebSocket-Server im Hook zu starten
module.exports.setupWebSocketServer = (server) => {
    muehleGame.setupWebSocketServer(server);
};
