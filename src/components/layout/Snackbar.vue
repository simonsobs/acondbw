<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    color="inverse-surface"
    class="text-on-inverse-surface"
    location="bottom left"
    min-width="256px"
  >
    {{ snackbarMessage }}
    <template v-slot:actions>
    <v-btn
      variant="text"
      icon
      @click="snackbar = false"
      color="on-inverse-surface"
    >
      <v-icon icon="mdi-close"></v-icon>
    </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";
const store = useStore();
const { snackbar, snackbarMessage } = storeToRefs(store);
const timeout = ref(5000);
</script>
