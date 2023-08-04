<template>
  <div>
    <navigation-admin v-model="drawer"></navigation-admin>
    <app-bar v-on:drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script>
import AppBar from "@/components/layout/AppBar.vue";
import NavigationAdmin from "./NavigationAdmin.vue";

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
