<template>
  <div class="g-container">
    <sign-in-card></sign-in-card>
  </div>
</template>

<script setup lang="ts">
import SignInCard from "@/components/auth/SignInCard.vue";
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
