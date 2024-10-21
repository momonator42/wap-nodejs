<template>
  <v-app>
    <v-container fluid class="fill-height pa-0 page-container" style="background-color: #e3f2fd;">
      <v-row class="justify-center align-center fill-height">
        <v-col cols="12" md="8">
          <TitleCard />

          <SectionCard title="Einführung" color="#f8bbd0">
            Das Mühlespiel ist ein traditionelles Brettspiel für zwei Spieler. Ziel des Spiels ist es, so viele gegnerische Steine wie möglich zu schlagen, indem man Mühlen bildet.
          </SectionCard>

          <SectionCard title="Spielmaterial" color="#b2dfdb">
            <ul>
              <li>Ein Mühlespielbrett mit 24 Punkten.</li>
              <li>9 weiße und 9 schwarze Steine.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Spielablauf" color="#c5e1a5">
            <PhaseCard title="Phase 1: Setzphase" color="#aed581">
              Die Spieler setzen abwechselnd ihre Steine auf die freien Schnittpunkte des Brettes. Wenn ein Spieler dabei eine Mühle bildet (drei eigene Steine in einer Reihe), darf er einen gegnerischen Stein entfernen.
            </PhaseCard>

            <PhaseCard title="Phase 2: Zugphase" color="#81c784">
              Nachdem alle Steine gesetzt sind, ziehen die Spieler abwechselnd ihre Steine zu benachbarten freien Punkten. Eine Mühle erlaubt wieder das Entfernen eines gegnerischen Steins.
            </PhaseCard>

            <PhaseCard title="Phase 3: Endphase" color="#66bb6a">
              Wenn ein Spieler nur noch drei Steine hat, darf er zu jedem freien Punkt springen. Das Spiel endet, wenn ein Spieler nur noch zwei Steine hat oder keinen gültigen Zug mehr machen kann.
            </PhaseCard>
          </SectionCard>

          <FooterComponent />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import TitleCard from "../components/RulePage/TitleCard.vue";
import SectionCard from "../components/RulePage/SectionCard.vue";
import PhaseCard from "../components/RulePage/PhaseCard.vue";
import FooterComponent from "../components/RulePage/FooterComponent.vue";

export default {
  name: "RegelnPage",
  components: {
    TitleCard,
    SectionCard,
    PhaseCard,
    FooterComponent,
  },
};
</script>

<style scoped>
.page-container {
  background-color: turquoise;
}

.fill-height {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

/* Schriftarten global */
.v-card-title,
.v-card-subtitle,
.v-card-text {
  color: #000;
}

.v-card-title {
  font-weight: bold;
}
</style>
