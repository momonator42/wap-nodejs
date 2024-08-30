const fetch = require('node-fetch');
const path = require("path");
const fs = require("fs");

export class Session {
    constructor(state, move) {
        if (state) {
            this.currentState = state;
        } else {
            let filePath = path.join(__dirname, "../init-gameState.json");
            this.currentState = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        if (move) {
            this.storedMove = move;
        } else {
            this.storedMove = null;
        }
    }

    static async playMove(session, move) {
        let payload = null;

        if (session.currentState.type === "MovingState" || session.currentState.type === "FlyingState") {
            if (!session.storedMove) {
                session.storedMove = move;
                return 201;
            } else {
                payload = {
                    Move: session.storedMove,
                    Shift: move,
                    State: session.currentState
                };
                session.storedMove = null;
            }
        } else {
            payload = {
                Move: move,
                State: session.currentState
            };
        }

        try {
            const response = await fetch("https://wap-mill-212a87db8908.herokuapp.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            session.currentState = await response.json();
            return 200;
        } catch (error) {
            console.error("Error forwarding the request: ", error);
            session.storedMove = null;
            return 500;
        }
    }
}