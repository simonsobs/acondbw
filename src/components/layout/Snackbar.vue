<template>
  <v-snackbar :timeout="5000" left bottom color="secondary" v-model="$store.state.snackbar">
    {{ $store.state.snackbarMessage }}
    <v-btn icon @click="$store.dispatch('closeSnackbar')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar"
};
</script>
