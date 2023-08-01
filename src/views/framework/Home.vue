<template>
  <div class="g-container">
    <dashboard></dashboard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "Home" });
</script>

<script setup lang="ts">
import Dashboard from "@/components/product/Dashboard.vue";
</script>

<style scoped>
.g-container {
  display: grid;
  block-size: 100%;
  place-items: center;
}
</style>