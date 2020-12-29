<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="grey"
  ></v-progress-circular>
  <v-card flat v-else>
    <v-card-title>Admin App</v-card-title>
    <v-card-actions>
      <v-btn block outlined @click="requestAuth">
        <v-icon left>mdi-github</v-icon>Store Admin App Token
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { redirectToGitHubAuthURL } from "@/utils/auth.js"

export default {
  name: "AdminAppTokenCard",
  data: () => ({
    loading: false,
  }),
  methods: {
    async requestAuth() {
      this.loading = true;
      try {
        this.$store.dispatch("clearAuthError");
        const callbackRoute = { name: "AdminAppAuth" };
        const scope = "read:org"; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        await redirectToGitHubAuthURL(window, this.$apollo, callbackRoute, scope);
      } catch (error) {
        this.$router.push({ name: "AdminAppTokenError" });
        this.loading = false;
      } 
    },
  },
};
</script>
