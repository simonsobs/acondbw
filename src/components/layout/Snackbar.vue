<template>
  <v-snackbar :timeout="5000" left bottom color="secondary" :value="snackbar">
    {{ snackbarMessage }}
    <v-btn icon @click="closeSnackbar">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState, mapActions } from "pinia";
import { useStore } from "@/stores/main";

export default defineComponent({
  name: "Snackbar",
  computed: {
    ...mapState(useStore, ["snackbar", "snackbarMessage"]),
  },
  methods: {
    ...mapActions(useStore, ["closeSnackbar"]),
  },
});
</script>
