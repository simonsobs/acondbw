<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <navigation></navigation>
    </v-navigation-drawer>
    <app-bar v-on:drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import Navigation from "./Navigation.vue";

export default {
  name: "Frame",
  components: {
    AppBar,
    Navigation,
  },
  data() {
    return {
      drawer: ['lg', 'xl'].includes(this.$vuetify.breakpoint.name),
    };
  },
};
</script>
