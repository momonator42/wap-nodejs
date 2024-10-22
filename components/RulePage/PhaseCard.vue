<template>
    <v-card flat :color="color" class="mt-2">
      <v-card-subtitle style="font-weight: bold; color: #000;">{{ title }}</v-card-subtitle>
      <v-card-text style="color: #000;">
        <slot></slot>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "PhaseCard",
    props: {
      title: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: "#ffffff",
      },
    },
  };
  </script>
  