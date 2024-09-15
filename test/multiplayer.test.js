const http = require('http');
const ioClient = require('socket.io-client');
const Multiplayer = require('../serverMiddleware/multiplayer');  // Pfad zur Multiplayer-Klasse

let server, multiplayer, clientSocket1, clientSocket2;

describe('Multiplayer Socket.IO Tests', () => {
    beforeAll((done) => {
        // Erstelle einen HTTP-Server und binde Socket.IO daran
        server = http.createServer();
        multiplayer = new Multiplayer(server);  // Initialisiere die Multiplayer-Instanz
        server.listen(() => {
            const port = server.address().port;
            // Verbinde zwei Clients
            clientSocket1 = ioClient(`http://localhost:${port}`);
            clientSocket2 = ioClient(`http://localhost:${port}`);
            done();
        });
    });

    afterAll((done) => {
        // Schließe die Client-Verbindungen
        clientSocket1.close();
        clientSocket2.close();
        // Schließe den Server
        server.close(done);
    });

    it('should allow client to join a game room', (done) => {
        const gameId = 'test-game-id';

        clientSocket1.emit('joinGame', gameId);

        clientSocket1.on('joinedGame', (data) => {
            expect(data).toHaveProperty('message', 'Gegner ist beigetreten!');
            done();
        });

        clientSocket2.emit('joinGame', gameId, true);
    });

    it('should notify clients when a player leaves the game', (done) => {
        const gameId = 'test-game-id';

        clientSocket1.emit('joinGame', gameId);

        clientSocket1.on('playerLeft', (data) => {
            expect(data).toHaveProperty('message', 'Der Spieler hat das Spiel verlassen.');
            done();
        });

        clientSocket2.emit('joinGame', gameId, true);
        clientSocket2.emit('leaveGame', gameId);
    });

    it('should notify all clients with board updates', (done) => {
        const gameId = 'test-game-id';
        const message = 'New move made';

        // Verbinde beide Clients
        clientSocket1.emit('joinGame', gameId);
        clientSocket2.emit('joinGame', gameId, true);

        // Beide Clients lauschen auf 'updateBoard'
        clientSocket1.on('updateBoard', (data) => {
            expect(data).toHaveProperty('gameId', gameId);
            expect(data).toHaveProperty('message', message);
            done();
        });

        // Sende die Nachricht vom Server
        multiplayer.notifyClients(gameId, message);
    });
});
