<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="secondary"
  ></v-progress-circular>
  <v-card flat v-else>
    <v-card-title>Sign In</v-card-title>
    <v-card-actions>
      <v-btn block outlined @click="signIn">
        <v-icon left>mdi-github</v-icon>Sign In with GitHub
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { v4 as uuidv4 } from "uuid";
import { Location } from "vue-router";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth";

export default Vue.extend({
  name: "SignInCard",
  data: () => ({
    loading: false,
  }),
  methods: {
    async signIn() {
      this.loading = true;
      try {
        this.clearAuthError();
        const callbackRoute: Location = { name: "Auth" };
        const scope = ""; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        const rawState: UnencodedState = {
          redirect: callbackRoute,
          randomString: uuidv4(),
        };
        const state = encodeAndStoreState(rawState);
        await redirectToGitHubAuthURL(this.$apollo, scope, state);
      } catch (error) {
        clearState();
        this.$router.push({ name: "SignInError" });
        this.loading = false;
      }
    },
    ...mapActions(useAuthStore, { clearAuthError: "clearAuthError" }),
  },
});
</script>
