<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="grey"
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { validateState } from "@/utils/auth.js";

export default {
  name: "Auth",
  data: () => ({}),
  methods: {
    async main() {
      const state = this.$route.query.state;
      if (!validateState(state)) {
        this.$router.push({ path: "/" });
        return;
      }

      if (this.$route.query.error) {
        this.$store.dispatch("setRequestAuthError", this.$route.query);
        this.$router.push({ name: "SignInError" });
        return;
      }

      const code = this.$route.query.code;
      if (!code) {
        this.$router.push({ path: "/" });
        return;
      }

      try {
        await this.$store.dispatch("signIn", {
          code,
          state,
          apolloClient: this.$apollo,
        });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
        return;
      }
      this.$store.dispatch("snackbarMessage", "Signed in");
      this.$router.push({ name: "Dashboard" });
    },
  },
  mounted: async function () {
    this.main();
  },
};
</script>
