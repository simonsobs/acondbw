<template>
  <v-app-bar app dense clipped-left>
    <!-- <v-tooltip bottom open-delay="800">
      <template v-slot:activator="{ on }">
        <v-btn text icon exact v-on="on" @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>-->
    <v-app-bar-nav-icon @click="$emit('drawer')" />
    <v-toolbar-title>
      <router-link to="/" v-text="title" style="text-decoration: none; color: inherit;"></router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <search-window></search-window>
    <v-spacer></v-spacer>
    <user-menu-button></user-menu-button>
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
import WebConfig from "@/graphql/site/WebConfig.gql";

import SearchWindow from "@/components/utils/SearchWindow";
import UserMenuButton from "@/components/auth/UserMenuButton";

export default {
  name: "AppBar",
  components: {
    SearchWindow,
    UserMenuButton
  },
  data: () => ({
    graphiqlUrl: process.env.VUE_APP_GRAPHQL_HTTP,
    title: null,
    error: null
  }),
  apollo: {
    title: {
      query: WebConfig,
      update: data =>
        data.webConfig ? data.webConfig.toolbarTitle : null,
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
  },
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
