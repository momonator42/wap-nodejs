const axios = require('axios');

class Game {
    constructor() {
        this.gameOver = false;
        this.initializeGame();
        this.bindEvents();
    }

    async initializeGame() {
        try {
            const response = await axios.post("/api/newGame");
            this.gameOver = false;
            this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
        } catch (err) {
            console.error("Error starting new game:", err);
            this.showPopup("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
        }
    }

    bindEvents() {
        document.querySelectorAll(".circle").forEach(circle => {
            circle.addEventListener("click", (event) => this.handleCircleClick(event));
        });
        document.querySelector("#new-game-btn").addEventListener("click", (event) => this.handleNewGameClick(event));

        document.querySelector("#multiplayer").addEventListener("click", () => this.showPopup("Coming Soon"));

        document.querySelector("#popup-close").addEventListener("click", () => {
            this.hidePopup();
        });
    }

    async handleCircleClick(event) {
        if (this.gameOver) {
            this.showPopup("Das Spiel ist beendet. Keine weiteren Züge sind erlaubt.");
            return;
        }

        const position = event.currentTarget.getAttribute('data-position').split('-');
        const move = {
            x: parseInt(position[1]),
            y: parseInt(position[2]),
            ring: parseInt(position[0])
        };

        try {
            const response = await axios.post("/api/play", { Move: move });
            console.log("Response from Middleware:", response.data);

            if (response.data.game?.board?.fields && response.data.message !== "Move gespeichert, Shift erwartet.") {
                this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
            } else if (response.data.message === "Das Spiel ist beendet.") {
                const selector = `.circle[data-position='${move.ring}-${move.x}-${move.y}']`;
                document.querySelector(selector).style.backgroundColor = "black";
                document.querySelector("h2").innerHTML = `Game Over`;
                this.gameOver = true;
            } else {
                console.log("Board update not required.");
            }
        } catch (err) {
            console.log("error: " + err.response.data.error)
            this.showPopup(err.response?.data?.error || "Ein Fehler ist aufgetreten.");
        }
    }

    async handleNewGameClick(event) {
        event.preventDefault();
        try {
            const response = await axios.post("/api/newGame");
            this.gameOver = false;
            console.log("New game started:", response.data);
            this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
        } catch (err) {
            console.error("Error starting new game:", err);
            this.showPopup("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
        }
    }

    updateStatus(currentPlayer, gameState) {
        document.querySelector("h2").innerHTML = `Current Player: ${currentPlayer.color} <br> State: ${gameState}`;
    }

    updateBoard(fields, currentPlayer, gameState) {
        document.querySelectorAll(".circle").forEach(circle => {
            const position = circle.getAttribute('data-position').split('-');
            const ring = parseInt(position[0]);
            const x = parseInt(position[1]);
            const y = parseInt(position[2]);

            const field = fields.find(f => f.ring === ring && f.x === x && f.y === y);

            if (field && field.color !== "⚫") {
                circle.style.backgroundColor = field.color === "🔴" ? "red" : "blue";
            } else {
                circle.style.backgroundColor = "black";
            }
        });

        this.updateStatus(currentPlayer, gameState);
    }

    showPopup(message) {
        document.querySelector("#popup-message").textContent = message;
        document.querySelector("#custom-popup").classList.remove("hidden");
    }

    hidePopup() {
        document.querySelector("#custom-popup").classList.add("hidden");
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        new Game();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}
