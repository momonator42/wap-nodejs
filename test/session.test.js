const request = require("supertest");
const express_session = require("express-session");
import { Session } from "../serverMiddleware/session"
const axios = require("axios");
const path = require("path");
const fs = require("fs");

describe("Session", () => {
    it('should initialize the field', async () => {

        let session = new Session();

        expect(session.currentState).not.toEqual(null);

        expect(session.storedMove).toEqual(null);
    });

    it("should do the first move", async () => {
        let session = new Session();

        let code = await Session.playMove(session, { x: 0, y: 0, ring: 0 });
        expect(code).toEqual(200);

        expect(session.currentState.game.currentPlayer.color).toEqual("🔵");
        expect(session.currentState.game.board.fields[0].color).toEqual("🔴");
    })

    it("it should select a field in movingState", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let session = new Session(movingFileJson, null);

        let code = await Session.playMove(session, { x: 1, y: 0, ring: 0 });

        expect(code).toEqual(201);
    })

    it("it should move a field in movingState", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let session = new Session(movingFileJson, { x: 1, y: 0, ring: 0 });

        let code = await Session.playMove(session, { x: 0, y: 0, ring: 0 });

        expect(code).toEqual(200);
    })

    it("it should handle a wrong move", async () => {
        const movingFilePath = path.join(__dirname, "mocks", "gameSimulation.json");
        const movingFileData = fs.readFileSync(movingFilePath, "utf-8");
        let movingFileJson = JSON.parse(movingFileData);

        let session = new Session(movingFileJson, { x: 0, y: 0, ring: 0 });

        let code = await Session.playMove(session, { x: 0, y: 0, ring: 0 });

        expect(code).toEqual(500);
    })
});
