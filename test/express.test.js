const request = require("supertest");
const app = require("../serverMiddleware/express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

jest.mock("axios");

describe("MuehleGame API", () => {
    let mockResponse;
    let expectedResponse;

    beforeAll(() => {
        const mockFilePath = path.join(__dirname, "mocks", "mockResponse.json");
        const mockFileData = fs.readFileSync(mockFilePath, "utf-8");
        mockResponse = JSON.parse(mockFileData);
        const initFilePath = path.join(__dirname, "mocks", "init-gameStateTest.json");
        const initFileData = fs.readFileSync(initFilePath, "utf-8");
        expectedResponse = JSON.parse(initFileData);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should start a new game", async () => {
        const response = await request(app).post("/api/newGame").expect(200);
        expect(response.body).toEqual(expectedResponse);
    });

    it("should return the current game state", async () => {
        const agent = request.agent(app);
        const init = await agent
            .post("/api/newGame")
            .expect(200);
        const response = await agent.get("/api").expect(200);
        expect(response.body).toEqual(expectedResponse);
    });

    it("should make a move", async () => {
        const agent = request.agent(app);

        const init = await agent
            .post("/api/newGame")
            .expect(200);
    
        axios.post.mockResolvedValue({ data: mockResponse });
    
        const response = await agent
            .post("/api/play")
            .send({ Move: { x: 0, y: 0, ring: 0 } })
            .expect(200);
    
        expect(axios.post).toHaveBeenCalled();
    
        expect(response.body).toEqual(mockResponse);
    });
});
