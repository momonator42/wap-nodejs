$(document).ready(function () {

    class Game {
        constructor() {
            this.gameOver = false;
            this.initializeGame();
            this.bindEvents();
        }

        initializeGame() {
            $.post("/api/newGame", (response) => {
                this.gameOver = false;
                console.log("New game started:", response);
                this.updateBoard(response.game.board.fields, response.game.currentPlayer, response.type);
            }).fail((err) => {
                console.error("Error starting new game:", err);
                alert("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
            });
        }

        bindEvents() {
            $(".circle").click((event) => this.handleCircleClick(event));
            $("#new-game-btn").click((event) => this.handleNewGameClick(event));
        }

        handleCircleClick(event) {
            if (this.gameOver) {
                console.log("Das Spiel ist beendet. Keine weiteren Züge sind erlaubt.");
                return;
            }

            const position = $(event.currentTarget).data('position').split('-');
            const move = {
                x: parseInt(position[1]),
                y: parseInt(position[2]),
                ring: parseInt(position[0])
            };

            $.post("/api/play", { Move: move }, (response) => {
                console.log("Response from Middleware:", response);
                if (response.game?.board?.fields && response.message !== "Move gespeichert, Shift erwartet.") {
                    this.updateBoard(response.game.board.fields, response.game.currentPlayer, response.type);
                } else if (response.message === "Das Spiel ist beendet.") {
                    const selector = `.circle[data-position='${move.ring}-${move.x}-${move.y}']`;
                    $(selector).css("background-color", "black");
                    $("h2").html(`Game Over`);
                    this.gameOver = true;
                } else {
                    console.log("Board update not required.");
                }
            }).fail((err) => {
                alert(err.responseJSON.error || "Ein Fehler ist aufgetreten.");
            });
        }

        handleNewGameClick(event) {
            event.preventDefault();
            $.post("/api/newGame", (response) => {
                this.gameOver = false;
                console.log("New game started:", response);
                this.updateBoard(response.game.board.fields, response.game.currentPlayer, response.type);
            }).fail((err) => {
                console.error("Error starting new game:", err);
                alert("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
            });
        }

        updateStatus(currentPlayer, gameState) {
            $("h2").html(`Current Player: ${currentPlayer.color} <br> State: ${gameState}`);
        }

        updateBoard(fields, currentPlayer, gameState) {
            $(".circle").each(function () {
                const position = $(this).data('position').split('-');
                const ring = parseInt(position[0]);
                const x = parseInt(position[1]);
                const y = parseInt(position[2]);

                const field = fields.find(f => f.ring === ring && f.x === x && f.y === y);

                if (field && field.color !== "⚫") {
                    $(this).css("background-color", field.color === "🔴" ? "red" : "blue");
                } else {
                    $(this).css("background-color", "black");
                }
            });

            this.updateStatus(currentPlayer, gameState);
        }
    }

    new Game();
});
