<template>
  <app v-if="!loading"> </app>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import axios from "axios";
import * as path from "path";
import App from "./AppWrapperProvideUrqlClient.vue";
const url = path.join(import.meta.env.VITE_PUBLIC_PATH, "config.json");
const loading = ref(true);
watchEffect(async () => {
  const response = await axios.get(url);
  console.log("response", response);
  loading.value = false;
});
</script>
