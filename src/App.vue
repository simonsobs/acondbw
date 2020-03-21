<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list shaped>
        <v-list-item
          link
          router
          v-for="page in pages"
          :key="page.name"
          :to="page.path"
        >
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
      <v-toolbar-title>
        <router-link to="/" v-text="title" style="text-decoration: none; color: inherit;"></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/about">
        <v-icon>mdi-information</v-icon>
      </v-btn>

      <v-menu
        left
        bottom
        offset-y
        open-on-hover
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-list-item-icon>
              <v-icon>mdi-invert-colors</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Toggle dark mode</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :href="graphiqlUrl" target="_blank">
            <v-list-item-icon>
              <v-icon>mdi-graphql</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>GraphiQL</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view :key="$route.name"></router-view>
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
    graphiqlUrl: process.env.VUE_APP_GRAPHQL_HTTP,
    pages: [
      { name: "Maps", path: "/maps", icon: "mdi-map" },
      { name: "Beams", path: "/beams", icon: "mdi-spotlight-beam" }
    ],
    drawer: null
  }),
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
