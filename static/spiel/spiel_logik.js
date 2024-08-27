$(document).ready(function() {
    let gameOver = false;

    function updateStatus(currentPlayer, gameState) {
        $("h2").html(`Current Player: ${currentPlayer.color} <br> State: ${gameState}`);
    }

    function updateBoard(fields, currentPlayer, gameState) {
        $(".circle").each(function() {
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

        updateStatus(currentPlayer, gameState)
    }

    $(".circle").click(function() {
        if (gameOver) {
            console.log("Das Spiel ist beendet. Keine weiteren Züge sind erlaubt.");
            return;
        }

        const position = $(this).data('position').split('-');
        const move = {
            x: parseInt(position[1]),
            y: parseInt(position[2]),
            ring: parseInt(position[0])
        };

        $.post("/api/play", { Move: move }, function(response) {
            console.log("Response from Middleware:", response);
            if (response.game?.board?.fields && response.message !== "Move gespeichert, Shift erwartet.") {
                updateBoard(response.game.board.fields, response.game.currentPlayer, response.type);
            } else if (response.message === "Das Spiel ist beendet.") {
                const selector = `.circle[data-position='${move.ring}-${move.x}-${move.y}']`;
                $(selector).css("background-color", "black");
                $("h2").html(`Game Over`);
                gameOver = true;
            } else {
                console.log("Board update not required.");
            }
        }).fail(function(err) {
            alert(err.responseJSON.error || "Ein Fehler ist aufgetreten.");
        });
    });

    $("#new-game-btn").click(function(e) {
        e.preventDefault();
        $.post("/api/newGame", function(response) {
            gameOver = false;
            console.log("New game started:", response);
            updateBoard(response.game.board.fields, response.game.currentPlayer, response.type);
        }).fail(function(err) {
            console.error("Error starting new game:", err);
            alert("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
        });
    });
});