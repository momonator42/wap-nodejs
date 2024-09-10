import { MultiplayerClient } from './multiplayer_clients.js';

class Game {
    constructor() {
        this.gameOver = false;
        this.multiplayerClient = new MultiplayerClient(this);
        this.initializeGame();
        this.bindEvents();
        this.toggleExitMultiplayerButton(false);
    }

    async initializeGame() {
        try {
            const response = await axios.get("/api");
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

        document.querySelector("#multiplayer").addEventListener("click", (event) => this.handleMultiplayerClick(event));

        document.querySelector("#popup-close").addEventListener("click", () => {
            this.hidePopup();
        });

        document.querySelector("#exit-multiplayer-btn").addEventListener("click", (event) => this.handleExitMultiplayerClick(event));
    }

    async handleExitMultiplayerClick(event) {
        event.preventDefault();
        const confirmation = confirm("Willst du das Multiplayer-Spiel wirklich verlassen?");
        if (confirmation) {
            try {
                const response = await axios.post("/api/exitMultiplayer");
                this.toggleExitMultiplayerButton(false);
                console.log("response exit: " + JSON.stringify(response.data.gameId));
                this.multiplayerClient.leaveGame(response.data.gameId);  // WebSocket-Nachricht zum Verlassen senden
                this.multiplayerClient.closeSocket();  // WebSocket schließen
                this.showPopup(response.data.message);
                this.updateBoard(response.data.state.currentState.game.board.fields, 
                    response.data.state.currentState.game.currentPlayer, 
                    response.data.state.currentState.type);
            } catch (err) {
                console.error("Fehler beim Verlassen des Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht verlassen werden.");
            }
        }
    }

    async handleMultiplayerClick(event) {
        const startNewGame = confirm("Willst du ein neues Multiplayer-Spiel starten?\n" 
            + "Wähle 'OK' für neues Spiel oder 'Abbrechen' um einem bestehenden Spiel beizutreten.");
        if (startNewGame) {
            try {
                const response = await axios.post("/api/startMultiplayer");
                this.gameOver = false;
                this.toggleExitMultiplayerButton(true);
                this.showPopup("Multiplayer-Spiel gestartet. Spiel-ID: " + response.data.gameId);
                this.multiplayerClient.initializeSocket();  // WebSocket initialisieren
                this.multiplayerClient.joinGame(response.data.gameId, false);  // Dem Spielraum beitreten
            } catch (err) {
                console.error("Fehler beim Starten eines Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht gestartet werden.");
            }
        } else {
            const gameId = prompt("Bitte gib die Spiel-ID ein, um beizutreten:");
            if (!gameId || gameId.trim() === "") {
                return;
            }
            try {
                this.multiplayerClient.initializeSocket();  // WebSocket initialisieren
                this.multiplayerClient.joinGame(gameId, true);  // Dem Spielraum beitreten
                const response = await axios.post("/api/joinMultiplayer", { gameId });
                this.gameOver = false;
                this.toggleExitMultiplayerButton(true);
                this.updateBoard(response.data.gameState.game.board.fields, 
                    response.data.gameState.game.currentPlayer, 
                    response.data.gameState.type);
            } catch (err) {
                console.error("Fehler beim Beitreten eines Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht beigetreten werden.");
            }
        }
    }

    toggleExitMultiplayerButton(show) {
        const exitButton = document.getElementById('hideButton');
        const buttonRow = exitButton.closest('.row');
        const buttons = document.querySelectorAll('.bar .col-3, .bar .col-4');
    
        if (show) {
            // Zeige den Exit Multiplayer Button an und ändere die Klassen zurück zu col-3
            exitButton.classList.remove('hiddenButton');
            buttonRow.classList.remove('g-4'); 
            buttonRow.classList.add('g-0'); 
            buttons.forEach(button => {
                button.classList.remove('col-4');
                button.classList.add('col-3');
            });
        } else {
            // Verstecke den Exit Multiplayer Button und ändere die Klassen auf col-4
            exitButton.classList.add('hiddenButton');
            buttonRow.classList.remove('g-0');
            buttonRow.classList.add('g-4');
            buttons.forEach(button => {
                button.classList.remove('col-3');
                button.classList.add('col-4');
            });
        }
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
