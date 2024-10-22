export class MultiplayerClient {
    constructor(game) {
        this.socket = null;
        this.game = game;  // Referenz auf das Spiel, um das Spielfeld und den Status zu aktualisieren
    }

    initializeSocket() {
        this.socket = io(window.location.origin, { autoConnect: false });

        // Verbindung manuell starten
        this.socket.connect();

        this.socket.on('connect', () => {
            console.log("Verbunden mit WebSocket-Server");
        });

        this.socket.on('connect_error', (err) => {
            console.error("Verbindungsfehler:", err);
        });

        // Nachrichten vom Server empfangen und das Spiel aktualisieren
        this.socket.on('updateBoard', (data) => {
            if (data.message.message === "Das Spiel ist beendet.") {
                this.game.updateGameOver(`Game Over`);
                return;
            }
            this.game.updateStatus(data.message.game.currentPlayer, data.message.type);
            this.game.updateBoard(data.message.game.board.fields, data.message.game.currentPlayer, data.message.type);
        });

        this.socket.on('joinedGame', (data) => {
            this.game.hidePopup();
            this.game.showPopup(data.message);
        })

        this.socket.on('roomFull', (data) => {
            this.closeSocket();
            console.log(data.message);  // Nachricht im Konsolen-Log anzeigen
            this.game.showPopup(data.message);  // Zeige eine Popup-Nachricht an den Benutzer
        });

        this.socket.on('playerLeft', (data) => {
            this.game.showPopup(data.message);  // Zeige eine Popup-Nachricht an die verbleibenden Spieler
        });

        this.socket.on('disconnect', () => {
            console.log("Verbindung zum WebSocket-Server verloren");
        });
    }

    // Dem Spielraum beitreten
    joinGame(gameId, enemy) {
        this.socket.emit('joinGame', gameId, enemy);
    }

    // Das Spiel verlassen
    leaveGame(gameId) {
        this.socket.emit('leaveGame', gameId);
    }

    // Schließe die WebSocket-Verbindung
    closeSocket() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log("WebSocket-Verbindung geschlossen");
        }
    }
}