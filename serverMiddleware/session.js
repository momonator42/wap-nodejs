import { GameState } from "./gameState"
import { v4 as uuidv4 } from 'uuid';

export class Session {
    constructor() {
        this.name = null;
        this.gameId = `game:${uuidv4()}`;
    }

    static async startMultiplayerGame(session, redisClient) {
        session.name = "PlayerOne";
        await Session.saveGameState(session, new GameState(), redisClient);
        return await Session.loadGameState(session, redisClient);
    }

    static async endMultiplayerGame(session, redisClient) {
        const oldGameId = session.gameId;
        session.name = null;
        session.gameId = `game:${uuidv4()}`;
        await Session.saveGameState(session, new GameState(), redisClient);
        const result = await Session.loadGameState(session, redisClient);
        return { oldGameId, result };
    }

    static async joinMultiplayerGame(session, redisClient, game) {
        session.name = "PlayerTwo";
        session.gameId = game;
        let result = await Session.loadGameState(session, redisClient);
        return result.currentState;
    }

    static async playMove(session, redisClient, move) {
        try {
            const gameState = await Session.loadGameState(session, redisClient);
            if (session.name != null && session.name != gameState.currentState.game.currentPlayer.name) {
                return 401;
            }
            const code = await GameState.playMove(gameState, move);
            await Session.saveGameState(session, gameState, redisClient);
            return code;
        } catch(err) {
            return 500;
        }
    }

    static async saveGameState(session, gameState, redisClient) {
        try {
            await redisClient.set(session.gameId, JSON.stringify(gameState));
            await redisClient.expire(session.gameId, 350);
        } catch (error) {
            console.error('Fehler beim Speichern des Spielzustands:', error);
        }
    }

    static async loadGameState(session, redisClient) {
        try {
            const jsonString = await redisClient.get(session.gameId);
            const gameState = JSON.parse(jsonString);
            return gameState;
        } catch (error) {
            console.log("session id: " + JSON.stringify(session.gameId));
            console.error('Fehler beim Laden des Spielzustands:', error);
        }
    }
}