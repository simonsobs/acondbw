<template>
  <v-app-bar app dense clipped-left>
    <v-app-bar-nav-icon @click="$emit('drawer')" />
    <v-toolbar-title>
      <router-link to="/" v-text="title" style="text-decoration: none; color: inherit;"></router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <search-window></search-window>
    <v-spacer></v-spacer>
    <sign-in-button></sign-in-button>
    <v-spacer></v-spacer>
    <v-btn icon to="/about">
      <v-icon>mdi-information</v-icon>
    </v-btn>

    <v-menu left bottom offset-y open-on-hover :close-on-content-click="false">
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
</template>

<script>
import SearchWindow from "@/components/SearchWindow";
import SignInButton from "@/components/SignInButton";

export default {
  name: "AppBar",
  components: {
    SearchWindow,
    SignInButton
  },
  data: () => ({
    title: process.env.VUE_APP_TOOLBAR_TITLE,
    graphiqlUrl: process.env.VUE_APP_GRAPHQL_HTTP
  }),
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
