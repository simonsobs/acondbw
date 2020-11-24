<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <navigation></navigation>
    </v-navigation-drawer>
    <app-bar v-on:drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script>
import AppBar from "./AppBar";
import Navigation from "./Navigation";

export default {
  name: "Frame",
  components: {
    AppBar,
    Navigation,
  },
  data: () => ({
    drawer: true,
  }),
};
</script>
