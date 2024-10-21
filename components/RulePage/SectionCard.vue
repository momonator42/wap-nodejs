<template>
    <v-card :color="color" class="mt-4">
      <v-card-title style="font-weight: bold; color: #000;">{{ title }}</v-card-title>
      <v-card-text style="color: #000;">
        <slot></slot>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "SectionCard",
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
  