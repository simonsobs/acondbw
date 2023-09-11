<template>
  <div class="g-container">
    <div class="text-h3 g-title"> {{ title }} </div>
    <sign-in-card></sign-in-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "@/plugins/pinia/stores/config";

import SignInCard from "@/components/auth/SignInCard.vue";

const configStore = useConfigStore();
const title = computed(() => configStore.config.toolbarTitle || "");
</script>

<style scoped>
.g-container {
  display: grid;
  block-size: 100%;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 6px;
  justify-items: center;
  align-items: center;
  align-content: space-around;
}

.g-title {
  inline-size: fit-content;
  text-align: center;
  margin: 8px;
}
</style>
