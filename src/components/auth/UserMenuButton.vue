<template>
  <span>
    <span v-if="user">
      <v-menu bottom offset-y v-model="menu">
        <template v-slot:activator="{ on, attr }">
          <v-btn icon class="no-uppercase" v-bind="attr" v-on="on">
            <v-avatar size="36">
              <img :src="user.avatarUrl" :alt="user.login" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.login }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon left>mdi-github</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-divider></v-divider>
          <template v-if="isAdmin">
            <v-list-item :to="{ name: 'Admin' }">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Admin</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Sign Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <sign-out-confirmation
              v-on:finished="
                dialog = false;
                menu = false;
              "
            ></sign-out-confirmation>
          </v-dialog>
        </v-list>
      </v-menu>
    </span>
    <v-btn v-else depressed :to="pathToSignIn">
      <v-icon left>mdi-github</v-icon>
      Sign In
    </v-btn>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

import SignOutConfirmation from "./SignOutConfirmation.vue";

export default Vue.extend({
  name: "UserMenuButton",
  components: { SignOutConfirmation },
  data: () => ({
    menu: false,
    dialog: false,
  }),
  computed: {
    pathToSignIn() {
      return this.$router.resolve({ name: "SignIn" }).route.path;
      // i.e., "/signin"
    },
    ...mapState(useAuthStore, { user: "gitHubViewer", isAdmin: "isAdmin" }),
  },
});
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
