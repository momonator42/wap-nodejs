const request = require("supertest");
import { GameState } from "../serverMiddleware/gameState";
import { Session } from "../serverMiddleware/session"
const { createClient } = require("redis");

jest.unmock('redis');

describe("Session", () => {
    let redisClient;

    beforeEach(async () => {
        redisClient = createClient({
            url:  process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false  // Akzeptiert selbstsignierte Zertifikate (ACHTUNG: Sicherheitsrisiko!)
            }
        });
        if (redisClient.isOpen) {
            await redisClient.disconnect();
        }
        await redisClient.connect().catch(console.error);
    })

    it('should initialize a Session', async () => {
        let session = new Session();
        expect(session.name).toEqual(null);
    });

    it('should start the multiplayer', async () => {
        let session = new Session();
        let result = await Session.startMultiplayerGame(session, redisClient);

        expect(session.name).toEqual("PlayerOne");
    });

    it('should end the multiplayer', async () => {
        let session = new Session();
        let result = await Session.endMultiplayerGame(session, redisClient);

        expect(session.name).toEqual(null);
    });

    it('should join the multiplayer', async () => {
        let sessionPlayerOne = new Session();
        await Session.startMultiplayerGame(sessionPlayerOne, redisClient);

        let sessionPlayerTwo = new Session();

        let result = await Session.joinMultiplayerGame(sessionPlayerTwo, redisClient, sessionPlayerOne.gameId);

        expect(sessionPlayerOne.name).toEqual("PlayerOne");
        expect(sessionPlayerTwo.name).toEqual("PlayerTwo");
        expect(sessionPlayerOne.gameId).toEqual(sessionPlayerTwo.gameId);
    });

    it('should make some moves', async () => {
        let session = new Session();

        await Session.saveGameState(session, new GameState(), redisClient);
        
        let code = await Session.playMove(session, redisClient, { x: 0, y: 0, ring: 0 });
        expect(code).toEqual(200);
    });

    it('should make a wrong move', async () => {
        let sessionPlayerOne = new Session();
        await Session.startMultiplayerGame(sessionPlayerOne, redisClient);

        let sessionPlayerTwo = new Session();

        let result = await Session.joinMultiplayerGame(sessionPlayerTwo, redisClient, sessionPlayerOne.gameId);
        
        let code = await Session.playMove(sessionPlayerTwo, redisClient, { x: 0, y: 0, ring: 0 });
        expect(code).toEqual(401);
    });

    
    afterEach(async () => {
        if (redisClient.isOpen) {
            await redisClient.disconnect();
        }
    });
})