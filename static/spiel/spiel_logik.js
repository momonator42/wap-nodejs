$(document).ready(function() {
    function updateBoard(fields) {
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
    }

    $(".circle").click(function() {
        const position = $(this).data('position').split('-');
        const move = {
            x: parseInt(position[1]),
            y: parseInt(position[2]),
            ring: parseInt(position[0])
        };

        $.post("/api/play", { Move: move }, function(response) {
            console.log("Response from Middleware:", response);
            if (response.game?.board?.fields && response.message !== "Move gespeichert, Shift erwartet.") {
                updateBoard(response.game.board.fields);
            } else {
                console.log("Board update not required.");
            } 
        }).fail(function(err) {
            console.error("Error:", err);
        });
    });

    $("#new-game-btn").click(function(e) {
        e.preventDefault();
        $.post("/api/newGame", function(response) {
            console.log("New game started:", response);
            updateBoard(response.game.board.fields);
        }).fail(function(err) {
            console.error("Error starting new game:", err);
        });
    });
});