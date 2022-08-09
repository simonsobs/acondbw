<template>
  <v-snackbar :timeout="5000" left bottom color="secondary" :value="snackbar">
    {{ snackbarMessage }}
    <v-btn icon @click="closeSnackbar">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useStore } from "@/stores/main";

export default Vue.extend({
  name: "Snackbar",
  computed: {
    ...mapState(useStore, ["snackbar", "snackbarMessage"]),
  },
  methods: {
    ...mapActions(useStore, ["closeSnackbar"]),
  },
});
</script>
