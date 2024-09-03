const request = require('supertest');
const { createClient } = require('redis');
const MuehleGame = require('../serverMiddleware/express');
import { Session } from "../serverMiddleware/session";

jest.mock("../serverMiddleware/session");
jest.mock('redis');

describe('MuehleGame API', () => {
    let app;
    let agent;
    let redisClient;
    let mockSession;

    beforeEach(() => {
        app = MuehleGame;
        agent = request.agent(MuehleGame);
        redisClient = createClient(); // Dies ist jetzt der ioredis-mock Client
        redisClient.flushall(); // Leert den Redis-Store vor jedem Test

        mockSession = {
            session: {
                currentState: {},
                save: jest.fn()  // Hier mocken wir die save-Methode
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Setzt alle Mocks nach jedem Test zurück
    });

    describe('POST /api/newGame', () => {
        it('should start a new game and initialize session', async () => {
            const response = await agent
                .post('/api/newGame')
                .expect(200);
        });
    });

    describe('GET /api', () => {
        it('should return the current game state', async () => {
            await agent.post('/api/newGame');
            const response = await agent
                .get('/api')
                .expect(200);
        });
    });

    describe('POST /api/play', () => {
        it('should play a move and update the game state', async () => {
            Session.playMove.mockResolvedValue(200);
            // Initialisiere das Spiel zuerst
            await agent.post('/api/newGame');

            const response = await agent
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(200);
        });

        it('should return 500 if the move cannot be processed', async () => {
            Session.playMove.mockResolvedValue(500);
            // Initialisiere das Spiel zuerst
            await agent.post('/api/newGame');

            const responseFailure = await agent
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(500);
        });

        it('should play a move and save the field', async () => {
        
            Session.playMove.mockResolvedValue(201);
            // Initialisiere das Spiel zuerst
            await agent.post('/api/newGame');
    
            const response = await agent
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(200);
        });
    });
});