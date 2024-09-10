<template>
    <div class="page-container">
      <div class="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" stroke="black" fill="none" stroke-width="2" />
          <rect x="25" y="25" width="50" height="50" stroke="black" fill="none" stroke-width="2" />
          <rect x="40" y="40" width="20" height="20" stroke="black" fill="none" stroke-width="2" />
          <line x1="10" y1="50" x2="40" y2="50" stroke="black" stroke-width="2" />
          <line x1="60" y1="50" x2="90" y2="50" stroke="black" stroke-width="2" />
          <line x1="50" y1="10" x2="50" y2="40" stroke="black" stroke-width="2" />
          <line x1="50" y1="60" x2="50" y2="90" stroke="black" stroke-width="2" />
          <circle cx="10" cy="10" r="3" fill="black" />
          <circle cx="10" cy="50" r="3" fill="black" />
          <circle cx="10" cy="90" r="3" fill="black" />
          <circle cx="50" cy="10" r="3" fill="black" />
          <circle cx="50" cy="90" r="3" fill="black" />
          <circle cx="90" cy="10" r="3" fill="black" />
          <circle cx="90" cy="50" r="3" fill="black" />
          <circle cx="90" cy="90" r="3" fill="black" />
          <circle cx="25" cy="25" r="3" fill="black" />
          <circle cx="25" cy="50" r="3" fill="black" />
          <circle cx="25" cy="75" r="3" fill="black" />
          <circle cx="50" cy="25" r="3" fill="black" />
          <circle cx="50" cy="75" r="3" fill="black" />
          <circle cx="75" cy="25" r="3" fill="black" />
          <circle cx="75" cy="50" r="3" fill="black" />
          <circle cx="75" cy="75" r="3" fill="black" />
        </svg>
      </div>
      <div class="container">
        <h1>Willkommen zum Mühlespiel</h1>
        <router-link to="/spiel" class="play-link">
          <div class="play-button">
            <i class="bi bi-play-fill"></i>
          </div>
        </router-link>
        <router-link to="/regeln" class="play-link">
          <div class="play-button">
            <i class="bi bi-book"></i>
          </div>
        </router-link>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: "HomePage",
  };
</script>
  
<style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding-top: 50px;
  }
  
  .svg-container {
    margin-bottom: 20px;
    background-color: white;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 30vw;
    height: 30vw;
    max-width: 25vh;
    max-height: 25vh;
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
  
  .play-link {
    display: inline-block;
    margin: 10px;
  }
  
  .play-button {
    background-color: #007bff;
    border: none;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .play-button i {
    font-size: 48px;
    color: #000;
  }
  
  .play-button:hover {
    transform: scale(1.1);
  }
</style>
  