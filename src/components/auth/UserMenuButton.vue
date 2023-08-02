<template>
  <span>
    <span v-if="user">
      <v-menu bottom offset-y v-model="menu">
        <template v-slot:activator="{ props }">
          <v-btn icon class="no-uppercase" v-bind="props">
            <v-avatar size="36px">
              <v-img :src="user.avatarUrl" :alt="user.login"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :title="user.name" :subtitle="user.login" append-icon="mdi-github">
          </v-list-item>
          <v-divider></v-divider>
          <template v-if="isAdmin">
            <v-list-item :to="{ name: 'Admin' }" prepend-icon="mdi-cog" title="Admin">
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-logout" title="Sign Out">
              </v-list-item>
            </template>
            <sign-out-confirmation v-on:finished="
              dialog = false;
            menu = false;
            "></sign-out-confirmation>
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
import { defineComponent } from "vue"
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

import SignOutConfirmation from "./SignOutConfirmation.vue";

export default defineComponent({
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
