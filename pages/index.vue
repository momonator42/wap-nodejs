<template>
  <div class="page-container">
    <SVGComponent />
    <div class="container">
      <h1 class="arial-text">Willkommen zum Mühlespiel</h1>
      <ButtonComponent to="/spiel" icon="bi bi-play-fill" />
      <ButtonComponent to="/regeln" icon="bi bi-book" />
    </div>
  </div>
</template>

<script>
import SVGComponent from "../components/HomePage/SVGComponent.vue";
import ButtonComponent from "../components/HomePage/ButtonComponent.vue";

export default {
  name: "HomePage",
  components: {
    SVGComponent,
    ButtonComponent,
  }
};
</script>

<style scoped>
  .page-container {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding-top: 50px;
  }

  .arial-text {
    font-family: Arial, sans-serif !important;
  }

  .container {
    text-align: center;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 50vh;
    margin-top: 20px;
  }

  h1 {
    font-size: clamp(1.2rem, 5vw, 2rem);
    margin-bottom: 20px;
  }
</style>
