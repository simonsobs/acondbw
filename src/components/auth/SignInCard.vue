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

<script>
import { redirectToGitHubAuthURL } from "@/utils/auth";

export default {
  name: "SignInCard",
  data: () => ({
    loading: false,
  }),
  methods: {
    async signIn() {
      this.loading = true;
      try {
        this.$store.dispatch("clearAuthError");
        const callbackRoute = { name: "Auth" };
        const scope = ""; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        await redirectToGitHubAuthURL(
          window,
          this.$apollo,
          callbackRoute,
          scope
        );
      } catch (error) {
        this.$router.push({ name: "SignInError" });
        this.loading = false;
      }
    },
  },
};
</script>
