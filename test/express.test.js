const request = require('supertest');
const { createClient } = require('redis');
const MuehleGame = require('../serverMiddleware/express');
import { Session } from "../serverMiddleware/session";

jest.unmock('redis');

describe('MuehleGame API', () => {

    describe('GET /api', () => {
    
        it('should get a the current state', async () => {
            const response = await request.agent(MuehleGame)
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');
        });
    });

    describe('POST /api/newGame', () => {
        let agent = request.agent(MuehleGame);
    
        it('should start a new game and a new session', async () => {
            const response = await agent
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const response2 = await agent
            .post('/api/newGame')
            .expect(200);
        });
    });

    describe('POST /api/startMultiplayer', () => {
        let agent = request.agent(MuehleGame);

    
        it('should start Multiplayer' , async () => {
            const response = await agent
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responseStart = await agent
            .post('/api/startMultiplayer')
            .expect(200);
        });
    });

    describe('POST /api/joinMultiplayer', () => {
        let agent1 = request.agent(MuehleGame);
        let agent2 = request.agent(MuehleGame);

    
        it('should join Multiplayer Session' , async () => {
            const response = await agent1
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responseStart = await agent1
            .post('/api/startMultiplayer')
            .expect(200);

            //spieler 2

            const response2 = await agent2
            .get('/api')
            .expect(200);

            expect(response2.body.type).toEqual('SettingState');

            const responseJoin = await agent2
            .post('/api/joinMultiplayer')
            .send({ gameId: responseStart.body.gameId })
            .expect(200);

        });
    });

    describe('POST /api/ExitMultiplayer', () => {
        let agent1 = request.agent(MuehleGame);
        let agent2 = request.agent(MuehleGame);

    
        it('should exit Multiplayer Session' , async () => {
            const response = await agent1
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responseStart = await agent1
            .post('/api/startMultiplayer')
            .expect(200);

            //spieler 2

            const response2 = await agent2
            .get('/api')
            .expect(200);

            expect(response2.body.type).toEqual('SettingState');

            const responseJoin = await agent2
            .post('/api/joinMultiplayer')
            .send({ gameId: responseStart.body.gameId })
            .expect(200);

            //exit

            const responseExit = await agent2
            .post('/api/exitMultiplayer')
            .expect(200);

            expect(responseExit.body.message).toEqual('Sitzung verlassen!');
        });
    });

    describe('POST /api/play', () => {

        it('should play a move and update the game state', async () => {
            let agent = request.agent(MuehleGame);

            const response = await agent
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responsePlay = await agent
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(200);
        });

        it('should play the wrong player', async () => {
            let agent1 = request.agent(MuehleGame);
            let agent2 = request.agent(MuehleGame);

            const response = await agent1
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responseStart = await agent1
            .post('/api/startMultiplayer')
            .expect(200);

            //spieler 2

            const response2 = await agent2
            .get('/api')
            .expect(200);

            expect(response2.body.type).toEqual('SettingState');

            const responseJoin = await agent2
            .post('/api/joinMultiplayer')
            .send({ gameId: responseStart.body.gameId })
            .expect(200);

            //wrong player

            const responsePlay = await agent2
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(500);
        });

        it('should play the shift', async () => {
            let agent = request.agent(MuehleGame);

            jest.spyOn(Session, 'playMove').mockResolvedValue(201);

            const response = await agent
            .get('/api')
            .expect(200);

            expect(response.body.type).toEqual('SettingState');

            const responsePlay = await agent
                .post('/api/play')
                .send({ Move: { x: 1, y: 2, ring: 0 } }) // Sende einen Beispiel-Zug
                .expect(200);

            expect(responsePlay.body.message).toEqual("Move gespeichert, Shift erwartet.");
        });

    });
});