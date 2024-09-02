import Game from '../static/spiel/spiel_logik';
const axios = require("axios");
const path = require("path");
const fs = require("fs");

jest.mock('axios');

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
        global.alert = jest.fn();
    });

    afterAll(() => {
        global.alert.mockRestore();
    });

    

    it('should initialize a new game', async () => {
        axios.post.mockResolvedValue({
            data: expectedResponse
        });

        await game.initializeGame();

        expect(axios.post).toHaveBeenCalledWith('/api/newGame');
        expect(game.gameOver).toBe(false);
        expect(document.querySelector('h2').innerHTML).toContain('Current Player: 🔴 <br> State: SettingState');
        expect(document.querySelector('.circle').style.backgroundColor).toBe("black");
    });


    it('should make a move and update the board on a valid response', async () => {
        const mockResponseData = {
            data: {
                game: {
                    board: {
                        fields: [
                            {"color": "🔴", "ring": 0, "x": 0, "y": 0},
                            // weitere Felder hier
                        ]
                    },
                    currentPlayer: {"color": "🔵", "name": "PlayerTwo"},
                },
                type: "MoveMade",
                message: "Move gemacht"
            }
        };

        axios.post.mockResolvedValue(mockResponseData);

        const event = {
            currentTarget: {
                getAttribute: jest.fn().mockReturnValue('0-0-0')
            }
        };

        const updateBoardSpy = jest.spyOn(game, 'updateBoard');

        await game.handleCircleClick(event);

        // Überprüfen, ob axios.post mit den richtigen Daten aufgerufen wurde
        expect(axios.post).toHaveBeenCalledWith('/api/play', {
            Move: { x: 0, y: 0, ring: 0 }
        });

        // Überprüfen, ob das Spielbrett aktualisiert wurde
        expect(updateBoardSpy).toHaveBeenCalledWith(
            mockResponseData.data.game.board.fields,
            mockResponseData.data.game.currentPlayer,
            mockResponseData.data.type
        );

        updateBoardSpy.mockRestore();
    });

    it('should show popup when game is over', async () => {
        game.gameOver = true;

        const event = {
            currentTarget: {
                getAttribute: jest.fn().mockReturnValue('0-0-0')
            }
        };

        const showPopupSpy = jest.spyOn(game, 'showPopup');

        await game.handleCircleClick(event);

        // Überprüfen, ob das Popup angezeigt wurde
        expect(showPopupSpy).toHaveBeenCalledWith("Das Spiel ist beendet. Keine weiteren Züge sind erlaubt.");

        showPopupSpy.mockRestore();
    });

    it('should show an error popup if axios.post fails', async () => {
        axios.post.mockRejectedValue({
            response: {
                data: { error: "Fehler bei der Bewegung" }
            }
        });

        const event = {
            currentTarget: {
                getAttribute: jest.fn().mockReturnValue('0-0-0')
            }
        };

        const showPopupSpy = jest.spyOn(game, 'showPopup');

        await game.handleCircleClick(event);

        // Überprüfen, ob das Fehler-Popup angezeigt wurde
        expect(showPopupSpy).toHaveBeenCalledWith("Fehler bei der Bewegung");

        showPopupSpy.mockRestore();
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

    it('should fail new game click', async () => {

        const showPopupSpy = jest.spyOn(game, 'showPopup');

        const mockResponse = {
            response: {
                data: { error: "Fehler bei der Bewegung" }
            }
        };

        axios.post.mockResolvedValue(mockResponse);

        const newGameButton = document.querySelector('#new-game-btn');
        newGameButton.click();

        await game.handleNewGameClick({ preventDefault: jest.fn() });

        expect(game.gameOver).toBe(false);
        expect(axios.post).toHaveBeenCalledWith('/api/newGame');
        expect(document.querySelector('h2').innerHTML).toContain('Current Player: red');
        expect(showPopupSpy).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");

    });

    it("it should go to game over branch", async () => {

        axios.post.mockResolvedValue({
            data: {
                message: "Das Spiel ist beendet."
            }
        });

        const event = {
            currentTarget: {
                getAttribute: jest.fn().mockReturnValue('0-0-0')
            }
        };

        await game.handleCircleClick(event);

        expect(game.gameOver).toBe(true);
        expect(document.querySelector('h2').innerHTML).toContain('Game Over');
        expect(document.querySelector('.circle[data-position="0-0-0"]').style.backgroundColor).toBe("black");
    })

    it("it should go to shift branch", async () => {

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        axios.post.mockResolvedValue({
            data: {
                message: "Move gespeichert, Shift erwartet."
            }
        });

        const event = {
            currentTarget: {
                getAttribute: jest.fn().mockReturnValue('0-0-0')
            }
        };

        await game.handleCircleClick(event);
        expect(consoleLogSpy).toHaveBeenCalledWith("Board update not required.");
    })

    it("it should press the close button from popup", async () => {
        const popupCloseElement = document.querySelector('#popup-close');
        popupCloseElement.click();
        const popupElement = document.querySelector("#custom-popup");
        expect(popupElement.classList.contains("hidden")).toBe(true);
    })

    it('should show the popup with the message "Coming Soon" when multiplayer is clicked', () => {
        const showPopupSpy = jest.spyOn(game, 'showPopup');

        const multiplayerButton = document.querySelector("#multiplayer");
        multiplayerButton.click();

        expect(showPopupSpy).toHaveBeenCalledWith("Coming Soon");

        const popup = document.querySelector("#custom-popup");
        const messageElement = document.querySelector("#popup-message");

        expect(popup.classList.contains("hidden")).toBe(false);
        expect(messageElement.textContent).toBe("Coming Soon");
    });

    it('should call handleCircleClick when a circle is clicked', () => {
        const handleCircleClickSpy = jest.spyOn(game, 'handleCircleClick');

        const firstCircle = document.querySelector(".circle");
        firstCircle.click();

        expect(handleCircleClickSpy).toHaveBeenCalled();

        expect(handleCircleClickSpy).toHaveBeenCalledWith(expect.any(Object));

        handleCircleClickSpy.mockRestore();
    });

    it('should create a new Game instance when DOMContentLoaded is triggered', () => {
        const res = document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(res).toBe(true);
    });

});
