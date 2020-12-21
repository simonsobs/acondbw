<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <navigation-admin></navigation-admin>
    </v-navigation-drawer>
    <app-bar v-on:drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script>
import AppBar from "./AppBar";
import NavigationAdmin from "./NavigationAdmin";

export default {
  name: "FrameAdmin",
  components: {
    AppBar,
    NavigationAdmin,
  },
  data: () => ({
    drawer: true,
  }),
};
</script>
