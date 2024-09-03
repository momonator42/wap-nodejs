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
    }

    static async endMultiplayerGame(session, redisClient) {
        session = new Session();
        await Session.saveGameState(session, new GameState(), redisClient);
    }

    static async joinMultiplayerGame(session, redisClient) {
        session.name = "PlayerTwo";
        let result = await Session.loadGameState(session, redisClient);
        return result.currentState;
    }

    static async playMove(session, redisClient, move) {
        try {
            const gameState = await Session.loadGameState(session, redisClient);
            if (session.name != null && session.name != gameState.currentState.game.currentPlayer.name) {
                return 400;
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
            console.error('Fehler beim Laden des Spielzustands:', error);
        }
    }
}