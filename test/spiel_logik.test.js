import Game from '../static/spiel/spiel_logik';
const axios = require("axios");
const path = require("path");
const fs = require("fs");


describe('Game Class', () => {
    let game;
    let expectedResponse;

    beforeEach(() => {
        const initFilePath = path.join(__dirname, "mocks", "init-gameStateTest.json");
        const initFileData = fs.readFileSync(initFilePath, "utf-8");
        expectedResponse = JSON.parse(initFileData);
        const html = fs.readFileSync(path.resolve(__dirname, '../static/spiel/spiel.html'), 'utf8');
        document.body.innerHTML = html;
        game = new Game();
    });

    beforeAll(() => {
        // Mocke window.alert
        global.alert = jest.fn();
    });

    afterAll(() => {
        // Falls notwendig, kann der Mock entfernt werden
        global.alert.mockRestore();
    });

    

    it('should initialize a new game', async () => {
        await game.initializeGame();

        expect(game.gameOver).toBe(false);
        expect(document.querySelector('h2').innerHTML).toContain('Current Player: 🔴 <br> State: SettingState');
        expect(document.querySelector('.circle').style.backgroundColor).toBe("");
    });

    /*

    it('should handle circle click correctly', async () => {
        const mockPlayResponse = {
            data: {
                game: {
                    board: {
                        fields: [{ ring: 0, x: 0, y: 0, color: "🔵" }]
                    },
                    currentPlayer: { color: "blue" }
                },
                message: "Move gespeichert."
            }
        };

        axios.post.mockResolvedValue(mockPlayResponse);

        const circle = document.querySelector('.circle');
        circle.click();

        await game.handleCircleClick({ currentTarget: circle });

        expect(axios.post).toHaveBeenCalledWith('/api/play', {
            Move: { x: 0, y: 0, ring: 0 }
        });

        expect(circle.style.backgroundColor).toBe('blue');
        expect(document.querySelector('h2').innerHTML).toContain('Current Player: blue');
    });

    it('should handle new game click', async () => {
        const mockResponse = {
            data: {
                game: {
                    board: {
                        fields: [{ ring: 0, x: 0, y: 0, color: "🔴" }]
                    },
                    currentPlayer: { color: "red" }
                },
                type: "ongoing"
            }
        };

        axios.post.mockResolvedValue(mockResponse);

        const newGameButton = document.querySelector('#new-game-btn');
        newGameButton.click();

        await game.handleNewGameClick({ preventDefault: jest.fn() });

        expect(game.gameOver).toBe(false);
        expect(axios.post).toHaveBeenCalledWith('/api/newGame');
        expect(document.querySelector('h2').innerHTML).toContain('Current Player: red');
    });

    */
});
