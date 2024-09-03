const request = require("supertest");
const express_session = require("express-session");
import { GameState } from "../serverMiddleware/gameState"
const axios = require("axios");
const path = require("path");
const fs = require("fs");

describe("GameState", () => {
    it('should initialize the field', async () => {

        let gameState = new GameState();

        expect(gameState.currentState).not.toEqual(null);

        expect(gameState.storedMove).toEqual(null);
    });

    it("should do the first move", async () => {
        let gameState = new GameState();

        let code = await GameState.playMove(gameState, { x: 0, y: 0, ring: 0 });
        expect(code).toEqual(200);

        expect(gameState.currentState.game.currentPlayer.color).toEqual("🔵");
        expect(gameState.currentState.game.board.fields[0].color).toEqual("🔴");
    })

    it("it should select a field in movingState", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let gameState = new GameState(movingFileJson, null);

        let code = await GameState.playMove(gameState, { x: 1, y: 0, ring: 0 });

        expect(code).toEqual(201);
    })

    it("it should move a field in movingState", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let gameState = new GameState(movingFileJson, { x: 1, y: 0, ring: 0 });

        let code = await GameState.playMove(gameState, { x: 0, y: 0, ring: 0 });

        expect(code).toEqual(200);
    })

    it("it should handle a wrong move", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let gameState = new GameState(movingFileJson, { x: 0, y: 0, ring: 0 });

        let code = await GameState.playMove(gameState, { x: 0, y: 0, ring: 0 });

        expect(code).toEqual(500);
    })

    it("GameState should not be set", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let gameState = new GameState(movingFileJson, { x: 0, y: 0, ring: 0 });

        GameState.secret = null;

        let code = await GameState.playMove(gameState, { x: 0, y: 0, ring: 0 });

        expect(code).toEqual(500);
    })
});
