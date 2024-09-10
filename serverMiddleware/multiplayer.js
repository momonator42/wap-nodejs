const socketIo = require('socket.io');

class Multiplayer {
    constructor(server) {
        this.io = socketIo(server, {
            cors: {
                origin: "*",  // Passe die CORS-Einstellungen nach Bedarf an
                methods: ["GET", "POST"]
            }
        });

        this.setupSocketIO();
    }

    setupSocketIO() {
        this.io.on('connection', (socket) => {
            console.log(`Neuer Client verbunden: ${socket.id}`);

            // Event für den Beitritt zu einem Spielraum (gameId)
            socket.on('joinGame', (gameId, enemy) => {
                const room = this.io.sockets.adapter.rooms.get(gameId); // Prüfe die Clients im Raum

                // Wenn der Raum bereits einen Client hat, verweigere den Beitritt
                if (room && room.size === 2) {
                    console.log(`Raum ${gameId} ist bereits voll. Client ${socket.id} kann nicht beitreten.`);
                    socket.emit('roomFull', { message: 'Raum ist voll, Beitritt nicht möglich.' });
                } else {
                    console.log(`Client ${socket.id} tritt dem Raum ${gameId} bei.`);
                    socket.join(gameId); // Client tritt dem Raum bei
                    if (enemy) {
                        socket.to(gameId).emit('joinedGame', { message: 'Gegner ist beigetreten!' });
                    }
                }
            });

            // Event für das Verlassen eines Spielers
            socket.on('leaveGame', (gameId) => {
                console.log(`Client ${socket.id} hat das Spiel ${gameId} verlassen.`);
                
                // Den Client aus dem Raum entfernen
                socket.leave(gameId);

                // Informiere alle verbleibenden Spieler im Raum
                socket.to(gameId).emit('playerLeft', { message: `Der Spieler hat das Spiel verlassen.` });
            });

            socket.on('disconnect', () => {
                console.log(`Client ${socket.id} wurde getrennt`);
            });
        });
    }

    notifyClients(gameId, message) {
        // Socket.io für Echtzeit-Benachrichtigungen verwenden
        if (this.io) {
            this.io.to(gameId).emit('updateBoard', { gameId, message });
        }
    }

    broadcastMessage(gameId, message) {
        this.io.to(gameId).emit('updateBoard', { gameId, message });  // Broadcast message to all clients
    }
}

module.exports = Multiplayer;