<template>
    <router-link :to="to" class="play-link">
      <div class="play-button">
        <i :class="icon"></i>
      </div>
    </router-link>
  </template>
  
  <script>
  export default {
    name: "ButtonComponent",
    props: {
      to: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      }
    }
  };
  </script>
  
  <style scoped>
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
  