<template>
  <v-container fluid class="pa-0 ma-0 fill-height body">
    <v-row no-gutters>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.mdAndUp"
        app
        permanent
        color="rgba(230, 240, 243, 0.8)"
        class="rounded"
        width="200"
      >
        <v-list dense>
          <v-list-item>
            <router-link to="/">
              <v-btn block small color="secondary" class="black-text arial-text">&#8592; Zurück</v-btn>
            </router-link>
          </v-list-item>
          <v-list-item>
            <v-btn block small color="primary" class="black-text arial-text" @click="handleNewGameClick">Neues Spiel</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn block small color="success" class="black-text arial-text" @click="handleMultiplayerClick">Mehrspieler</v-btn>
          </v-list-item>
          <v-list-item id="hideButton" v-show="showExitButton">
            <v-btn block small color="error" class="black-text arial-text" @click="handleExitMultiplayerClick">verlassen</v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar 
        v-else 
        app 
        height="60px"
        color="rgba(230, 240, 243, 0.8)" 
        dense 
        flat 
        class="d-flex align-center"
      >
        <v-row no-gutters class="d-flex align-center" style="width: 100%;">
          <!-- Linke Seite: Zurück -->
          <v-col cols="auto" class="d-flex justify-start">
            <v-btn small color="secondary" class="black-text arial-text" @click="$router.push('/')">
              &#8592; Zurück
            </v-btn>
          </v-col>

          <!-- Mitte: Neues Spiel -->
          <v-col cols="auto" class="d-flex justify-center">
            <v-btn small color="primary" class="black-text arial-text" @click="handleNewGameClick">
              Neues Spiel
            </v-btn>
          </v-col>

          <!-- Rechte Seite: Mehrspieler -->
          <v-col cols="auto" class="d-flex justify-end">
            <v-btn small color="success" class="black-text arial-text" @click="handleMultiplayerClick">
              Mehrspieler
            </v-btn>
          </v-col>
        </v-row>
        
      </v-app-bar>

      <!-- Spielfeld -->
      <v-col cols="12" lg="10" xl="11" class="d-flex align-center justify-center">
        <div class="background">
          <div class="text-center">
            <h2 class="arial-text" v-html="statusMessage"></h2>
          </div>
          <div id="rand">
            <div id="board">
              <!-- Statische Linien -->
              <div class="line horizontal line1"></div>
              <div class="line vertical line2"></div>

              <!-- Ring 1 - Kreise -->
              <div class="ring1">
                <div class="circle top-left" data-position="1-0-0" :style="{ backgroundColor: getColor('1-0-0') }" @click="handleCircleClick('1-0-0')"></div>
                <div class="circle top-right" data-position="1-2-0" :style="{ backgroundColor: getColor('1-2-0') }" @click="handleCircleClick('1-2-0')"></div>
                <div class="circle top-center" data-position="1-1-0" :style="{ backgroundColor: getColor('1-1-0') }" @click="handleCircleClick('1-1-0')"></div>
                <div class="circle bottom-left" data-position="1-0-2" :style="{ backgroundColor: getColor('1-0-2') }" @click="handleCircleClick('1-0-2')"></div>
                <div class="circle bottom-right" data-position="1-2-2" :style="{ backgroundColor: getColor('1-2-2') }" @click="handleCircleClick('1-2-2')"></div>
                <div class="circle bottom-center" data-position="1-1-2" :style="{ backgroundColor: getColor('1-1-2') }" @click="handleCircleClick('1-1-2')"></div>
                <div class="circle center-left" data-position="1-0-1" :style="{ backgroundColor: getColor('1-0-1') }" @click="handleCircleClick('1-0-1')"></div>
                <div class="circle center-right" data-position="1-2-1" :style="{ backgroundColor: getColor('1-2-1') }" @click="handleCircleClick('1-2-1')"></div>

                <!-- Ring 2 - Kreise -->
                <div class="ring2">
                  <div class="circle top-left" data-position="2-0-0" :style="{ backgroundColor: getColor('2-0-0') }" @click="handleCircleClick('2-0-0')"></div>
                  <div class="circle top-right" data-position="2-2-0" :style="{ backgroundColor: getColor('2-2-0') }" @click="handleCircleClick('2-2-0')"></div>
                  <div class="circle top-center" data-position="2-1-0" :style="{ backgroundColor: getColor('2-1-0') }" @click="handleCircleClick('2-1-0')"></div>
                  <div class="circle bottom-left" data-position="2-0-2" :style="{ backgroundColor: getColor('2-0-2') }" @click="handleCircleClick('2-0-2')"></div>
                  <div class="circle bottom-right" data-position="2-2-2" :style="{ backgroundColor: getColor('2-2-2') }" @click="handleCircleClick('2-2-2')"></div>
                  <div class="circle bottom-center" data-position="2-1-2" :style="{ backgroundColor: getColor('2-1-2') }" @click="handleCircleClick('2-1-2')"></div>
                  <div class="circle center-left" data-position="2-0-1" :style="{ backgroundColor: getColor('2-0-1') }" @click="handleCircleClick('2-0-1')"></div>
                  <div class="circle center-right" data-position="2-2-1" :style="{ backgroundColor: getColor('2-2-1') }" @click="handleCircleClick('2-2-1')"></div>
                </div>
              </div>

              <!-- Kreise außerhalb der Ringe -->
              <div class="circle top-left" data-position="0-0-0" :style="{ backgroundColor: getColor('0-0-0') }" @click="handleCircleClick('0-0-0')"></div>
              <div class="circle top-right" data-position="0-2-0" :style="{ backgroundColor: getColor('0-2-0') }" @click="handleCircleClick('0-2-0')"></div>
              <div class="circle top-center" data-position="0-1-0" :style="{ backgroundColor: getColor('0-1-0') }" @click="handleCircleClick('0-1-0')"></div>
              <div class="circle bottom-left" data-position="0-0-2" :style="{ backgroundColor: getColor('0-0-2') }" @click="handleCircleClick('0-0-2')"></div>
              <div class="circle bottom-right" data-position="0-2-2" :style="{ backgroundColor: getColor('0-2-2') }" @click="handleCircleClick('0-2-2')"></div>
              <div class="circle bottom-center" data-position="0-1-2" :style="{ backgroundColor: getColor('0-1-2') }" @click="handleCircleClick('0-1-2')"></div>
              <div class="circle center-left" data-position="0-0-1" :style="{ backgroundColor: getColor('0-0-1') }" @click="handleCircleClick('0-0-1')"></div>
              <div class="circle center-right" data-position="0-2-1" :style="{ backgroundColor: getColor('0-2-1') }" @click="handleCircleClick('0-2-1')"></div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Popup für Nachrichten -->
    <div id="custom-popup" class="popup" v-if="isPopUpVisible">
      <div class="popup-content">
        <v-btn icon small id="popup-close" class="popup-close" @click="hidePopup">
          <v-icon color="white" style="font-size: 24px;">mdi-close</v-icon>
        </v-btn>
        <p class="arial-text">{{ popupMessage }}</p>
      </div>
    </div>

    <v-app-bar 
      v-if="showExitButton"
      app
      color="rgba(230, 240, 243, 0.8)"
      dense
      flat
      class="d-flex justify-center align-center"
      fixed
      bottom
    >
      <!-- Verlassen-Button unterhalb des Spielfelds -->
      <v-row no-gutters class="d-flex mt-4" style="width: 100%;" v-if="showExitButton">
        <v-spacer></v-spacer>
        <v-col cols="auto" class="text-center">
          <v-btn small color="error" class="black-text arial-text" @click="handleExitMultiplayerClick">
            verlassen
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-app-bar>
    
  </v-container>
</template>

<script>
import { MultiplayerClient } from '../static/spiel/multiplayer_clients';

export default {
  data() {
    return {
      isPopUpVisible: false,
      popupMessage: '',
      statusMessage: 'Current Player: 🔴 <br> State: SettingState',
      showExitButton: false, // Zustand für Multiplayer-Button
      gameOver: false,
      fields: [], // Spielfeld-Daten
      multiplayerClient: null,
    };
  },
  methods: {

    loadSocketIO() {
      const script = document.createElement('script');
      script.src = "/socket.io/socket.io.js";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Socket.io geladen');
        // Hier kannst du die Socket.io-Logik aufrufen, wenn nötig
      };

      script.onerror = () => {
        console.error('Fehler beim Laden von Socket.io');
      };
    },

    async initializeGame() {
      try {
        const response = await axios.get("/api");
        this.gameOver = false;
        this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
      } catch (err) {
        console.error("Error starting new game:", err);
        this.showPopup("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
      }
    },

    async handleMultiplayerClick() {
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
              if (err.response) {
                console.error("Fehler beim Starten eines Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht gestartet werden.");
              } else {
                this.showPopup("Du bist offline");
              }
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
              if (err.response) {
                console.error("Fehler beim Beitreten eines Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht beigetreten werden.");
              } else {
                this.showPopup("Du bist offline");
              }
            }
        }
    },
    
    async handleExitMultiplayerClick() {
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
              if (err.response) {
                console.error("Fehler beim Verlassen des Multiplayer-Spiels:", err);
                this.showPopup("Ein Fehler ist aufgetreten. Multiplayer-Spiel konnte nicht verlassen werden.");
              } else {
                this.showPopup("Du bist offline");
              }
            }
        }
    },

    async handleCircleClick(position) {
      if (this.gameOver) {
        this.showPopup("Das Spiel ist beendet. Keine weiteren Züge sind erlaubt.");
        return;
      }

      const [ring, x, y] = position.split('-').map(Number);
      const move = { x, y, ring };

      try {
        const response = await axios.post("/api/play", { Move: move });
        console.log("Response from Middleware:", response.data);

        if (response.data.game?.board?.fields && response.data.message !== "Move gespeichert, Shift erwartet.") {
          this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
        } else if (response.data.message === "Das Spiel ist beendet.") {
          this.updateGameOver(`Game Over`);
        }
      } catch (err) {
        if (err.response) {
          console.error("Fehler beim Ausführen des Zugs:", err);
          this.showPopup(err.response?.data?.error || "Ein Fehler ist aufgetreten.");
        } else {
          this.showPopup("Du bist offline");
        }
      }
    },

    async handleNewGameClick() {
      try {
            const response = await axios.post("/api/newGame");
            this.gameOver = false;
            console.log("New game started:", response.data);
            this.updateBoard(response.data.game.board.fields, response.data.game.currentPlayer, response.data.type);
      } catch (err) {
            if (err.response) {
              console.error("Error starting new game:", err);
              this.showPopup("Ein Fehler ist aufgetreten. Neues Spiel konnte nicht gestartet werden.");
            } else {
              this.showPopup("Du bist offline");
            }
      }
    },
    
    updateGameOver(gameState) {
      this.gameOver = true;
      this.statusMessage = gameState;
    },

    updateStatus(currentPlayer, gameState) {
      this.statusMessage = `Current Player: ${currentPlayer.color} <br> State: ${gameState}`;
    },

    updateBoard(fields, currentPlayer, gameState) {
      this.fields = fields.map(field => ({
        position: `${field.ring}-${field.x}-${field.y}`,
        color: field.color === "⚫" ? "black" : field.color === "🔴" ? "red" : "blue",
      }));
      this.statusMessage = `Current Player: ${currentPlayer.color} <br> State: ${gameState}`;
    },

    getColor(position) {
      const field = this.fields.find(f => f.position === position);
      return field ? field.color : 'black'; // Standardfarbe schwarz, falls keine Farbe vorhanden ist
    },

    showPopup(message) {
      this.popupMessage = message;
      this.isPopUpVisible = true;
    },

    hidePopup() {
      this.isPopUpVisible = false;
    },

    toggleExitMultiplayerButton(show) {
      this.showExitButton = show;
    },
  },
  mounted() {
    this.loadSocketIO();
    this.initializeGame(); // Starte das Spiel beim Mounten der Komponente
    this.multiplayerClient = new MultiplayerClient(this);
  },
};
</script>

<style scoped>
  .body {
      background-image: url('./assets/egyptian-background.jpg');
      background-size: cover;
      background-repeat: no-repeat; 
      background-position: center center;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 105vh;
  }

  .black-text {
      color: black !important;
  }

  .arial-text {
      font-family: Arial, sans-serif !important;
  }

  .background {
      position: relative;
      width: 90vw;
      height: 95vw;
      max-width: 95vh;
      max-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      background-color: rgba(230, 240, 243, 0.8);
      border-radius: 20px;
  }

  #rand {
      position: relative;
      width: 80vw;
      height: 80vw;
      max-width: 80vh;
      max-height: 80vh;
      border: 5px solid #000;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      background-color: brown;
      transform: translateY(5%);
  }

  #board {
      position: relative;
      width: 67vw;
      height: 67vw;
      max-width: 67vh;
      max-height: 67vh;
      border: 5px solid #000;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
  }

  .ring1 {
      position: relative;
      width: 50vw;
      height: 50vw;
      max-width: 50vh;
      max-height: 50vh;
      border: 5px solid #000;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .ring2 {
      position: relative;
      width: 30vw;
      height: 30vw;
      max-width: 30vh;
      max-height: 30vh;
      border: 5px solid #000;
      background-color: brown;
  }

  .line {
      position: absolute;
      background-color: #000;
  }

  .horizontal {
      width: 100%;
      height: 5px;
  }

  .vertical {
      width: 5px;
      height: 100%;
  }

  .line1 { top: 50.00%; left: 0; }

  .line2 { top: 0; left: 50.00%; }

  .circle {
      position: absolute;
      width: 3vw;
      height: 3vw;
      max-width: 40px;
      max-height: 40px;
      min-width: 25px;
      min-height: 25px;
      background-color: black; 
      border-radius: 50%; 
  }

  .circle:hover {
      width: 4vw;
      height: 4vw;
  }

  .top-left {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
  }

  .top-right {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
  }

  .bottom-left {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
  }

  .bottom-right {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
  }

  .center-left {
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
  }

  .center-right {
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
  }

  .top-center {
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
  }

  .bottom-center {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
  }

  .text-center h2 {
      position: absolute;
      color: black;
      font-weight: bold;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
  }

  @media (max-width: 576px) {
      /* Für kleine Bildschirme (wie Mobilgeräte) */
      .text-center h2 {
          top: 6%;
          font-size: 15px;
      }
  }

  @media (min-width: 577px) and (max-width: 768px) {
      /* Für mittelgroße Bildschirme (wie kleine Tablets) */
      .text-center h2 {
          top: 6%;
          font-size: 22px;
      }
  }

  @media (min-width: 769px) and (max-width: 992px) {
      /* Für größere Tablets und kleine Desktops */
      .text-center h2 {
          top: 6%;
          font-size: 32px;
      }
  }

  @media (min-width: 993px) {
      /* Für große Bildschirme (wie Desktop-Monitore) */
      .text-center h2 {
          top: 7%;
          font-size: 32px;
      }
  }

  .hidden {
      visibility: hidden;
  }

  .hiddenButton {
      display: None;
  }

  .popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .popup-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
      max-width: 400px;
      width: 100%;
      font-size: 25px;
      position: relative;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .popup-close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 32px;
      cursor: pointer;
      color: #fff; 
      font-weight: bold; 
      background: none; 
      border: none; 
      outline: none; 
  }
</style>
