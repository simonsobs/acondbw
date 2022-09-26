<template>
  <v-snackbar :timeout="5000" left bottom color="secondary" v-model="snackbar">
    {{ snackbarMessage }}
    <v-btn icon @click="snackbar = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
const store = useStore();
const { snackbar, snackbarMessage } = storeToRefs(store);
</script>
