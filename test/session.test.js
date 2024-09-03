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

        let gameState = new GameState();
        let session = new Session(redisClient);
        await Session.saveGameState(session, gameState, redisClient);
        const result = await Session.loadGameState(session, redisClient);

        let code = await GameState.playMove(gameState, { x: 0, y: 0, ring: 0 });
        expect(code).toEqual(200);
    });



    it('should make some moves', async () => {
        let session = new Session(redisClient);
        
        let code = await Session.playMove(session, redisClient, { x: 0, y: 0, ring: 0 });
    });

    
    afterEach(async () => {
        if (redisClient.isOpen) {
            await redisClient.disconnect();
        }
    });
})