<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <dashboard></dashboard>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "Home" });
</script>

<script setup lang="ts">
import Dashboard from "@/components/product/Dashboard.vue";
</script>
