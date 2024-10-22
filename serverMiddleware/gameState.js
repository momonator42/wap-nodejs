const fetch = require('node-fetch');
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');

export class GameState {

    static secret = process.env.JWT_SECRET;

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

    static createJWT() {
        if (!GameState.secret) {
            return 500;
        }

        const payload = {}; 
        return jwt.sign(payload, GameState.secret, { expiresIn: '1h' });
    }

    static async playMove(gameState, move) {
        let payload = null;

        if (gameState.currentState.type === "MovingState" || gameState.currentState.type === "FlyingState") {
            if (!gameState.storedMove) {
                gameState.storedMove = move;
                return 201;
            } else {
                payload = {
                    Move: gameState.storedMove,
                    Shift: move,
                    State: gameState.currentState
                };
                gameState.storedMove = null;
            }
        } else {
            payload = {
                Move: move,
                State: gameState.currentState
            };
        }

        const token = GameState.createJWT();

        try {
            const response = await fetch(process.env.WAP_MILL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            gameState.currentState = await response.json();
            return 200;
        } catch (error) {
            gameState.storedMove = null;
            return 500;
        }
    }
}