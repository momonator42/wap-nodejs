const fetch = require('node-fetch');
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');

export class Session {

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
        if (!Session.secret) {
            throw new Error('JWT_SECRET ist nicht in den Umgebungsvariablen gesetzt.');
        }

        // Minimaler Payload oder leer, wenn keine spezifischen Daten benötigt werden
        const payload = {}; // Kann leer sein oder minimale Daten enthalten
        return jwt.sign(payload, Session.secret, { expiresIn: '1h' });
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

        const token = Session.createJWT();
        console.log("token: " +  token);

        try {
            const response = await fetch(process.env.WAP_MILL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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