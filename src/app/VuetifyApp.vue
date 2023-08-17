<template>
  <v-app>
    <app></app>
  </v-app>
</template>

<script setup lang="ts">
import { useColorTheme } from "@/utils/color-theme";
import App from "./App.vue";
useColorTheme();
</script>
