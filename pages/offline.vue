<template>
    <div class="offline-container">
      <h1>Du bist offline</h1>
      <p>Es sieht so aus, als hättest du die Verbindung zum Internet verloren. Bitte stelle die Verbindung wieder her.</p>
      <nuxt-link to="/">Zur Startseite</nuxt-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OfflinePage',
  }
  </script>
  
  <style scoped>
  .offline-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: #f0f0f0;
    color: #333;
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  