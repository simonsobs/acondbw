<template>
  <div class="g-container">
    <dashboard></dashboard>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "@/components/product/dashboard/Dashboard.vue";
</script>

<style scoped>
.g-container {
  display: grid;
  block-size: 100%;
  place-items: center;
}
</style>
