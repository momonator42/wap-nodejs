<template>
    <v-app>
      <v-container fluid class="fill-height pa-0" style="background-color: #e3f2fd;">
        <v-row class="justify-center align-center fill-height">
          <v-col cols="12" md="8">
            <!-- Titel -->
            <v-card class="mx-auto" color="primary" dark>
              <v-card-title class="text-center" style="font-weight: bold; color: #000;">
                <v-icon left>mdi-gamepad-variant</v-icon> Regeln für das Mühlespiel
              </v-card-title>
            </v-card>
  
            <!-- Einführung -->
            <v-card class="mt-4" color="#f8bbd0">
              <v-card-title style="font-weight: bold; color: #000;">Einführung</v-card-title>
              <v-card-text style="color: #000;">
                Das Mühlespiel ist ein traditionelles Brettspiel für zwei Spieler. Ziel des Spiels ist es, so viele gegnerische Steine wie möglich zu schlagen, indem man Mühlen bildet.
              </v-card-text>
            </v-card>
  
            <!-- Spielmaterial -->
            <v-card class="mt-4" color="#b2dfdb">
              <v-card-title style="font-weight: bold; color: #000;">Spielmaterial</v-card-title>
              <v-card-text style="color: #000;">
                <ul>
                  <li>Ein Mühlespielbrett mit 24 Punkten.</li>
                  <li>9 weiße und 9 schwarze Steine.</li>
                </ul>
              </v-card-text>
            </v-card>
  
            <!-- Spielablauf -->
            <v-card class="mt-4" color="#c5e1a5">
              <v-card-title style="font-weight: bold; color: #000;">Spielablauf</v-card-title>
  
              <!-- Phase 1: Setzphase -->
              <v-card flat color="#aed581" class="mt-2">
                <v-card-subtitle style="font-weight: bold; color: #000;">Phase 1: Setzphase</v-card-subtitle>
                <v-card-text style="color: #000;">
                  Die Spieler setzen abwechselnd ihre Steine auf die freien Schnittpunkte des Brettes. Wenn ein Spieler dabei eine Mühle bildet (drei eigene Steine in einer Reihe), darf er einen gegnerischen Stein entfernen.
                </v-card-text>
              </v-card>
  
              <!-- Phase 2: Zugphase -->
              <v-card flat color="#81c784" class="mt-2">
                <v-card-subtitle style="font-weight: bold; color: #000;">Phase 2: Zugphase</v-card-subtitle>
                <v-card-text style="color: #000;">
                  Nachdem alle Steine gesetzt sind, ziehen die Spieler abwechselnd ihre Steine zu benachbarten freien Punkten. Eine Mühle erlaubt wieder das Entfernen eines gegnerischen Steins.
                </v-card-text>
              </v-card>
  
              <!-- Phase 3: Endphase -->
              <v-card flat color="#66bb6a" class="mt-2">
                <v-card-subtitle style="font-weight: bold; color: #000;">Phase 3: Endphase</v-card-subtitle>
                <v-card-text style="color: #000;">
                  Wenn ein Spieler nur noch drei Steine hat, darf er zu jedem freien Punkt springen. Das Spiel endet, wenn ein Spieler nur noch zwei Steine hat oder keinen gültigen Zug mehr machen kann.
                </v-card-text>
              </v-card>
            </v-card>
  
            <!-- Footer -->
            <v-footer color="primary" class="mt-5 white--text text-center">
              <v-col>
                Muhammed Ergül © 2024. Alle Rechte vorbehalten.
              </v-col>
            </v-footer>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
</template>
  
<script>
export default {
  name: "RegelnPage",
};

</script>

<style scoped src="./assets/regeln.css"></style>
  