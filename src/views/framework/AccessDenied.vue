<template>
  <div class="g-container">
    <v-col class="text-h3 text-center">
      <div>Access Denied</div>
      <v-btn class="mt-5" variant="outlined" :to="to">
        Go to the entry page
      </v-btn>
    </v-col>
  </div>
</template>

<script setup lang="ts">
const to = { name: "Entry" };
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
