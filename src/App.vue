<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list shaped>
        <v-list-item link router v-for="page in pages" :key="page.name" :to="page.path">
          <v-list-item-action>
            <v-icon v-text="page.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="page.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/about" v-on="on">
            <v-icon>mdi-information</v-icon>
      </v-btn>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark" v-on="on">
            <v-icon>mdi-invert-colors</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark mode</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    title: process.env.VUE_APP_TOOLBAR_TITLE,
    pages: [
      {name: "Maps", path: "/maps", icon: "mdi-map"},
      {name: "Beams", path: "/beams", icon: "mdi-spotlight-beam"}
    ],
    drawer: null
  }),
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
