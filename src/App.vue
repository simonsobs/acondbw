<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link router :to="'/'">
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router :to="'/about'">
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link router :to="'/maps'">
          <v-list-item-content>
            <v-list-item-title>Maps</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: null
  }),
};
</script>
