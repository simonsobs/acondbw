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
export default {
  name: "Auth",
  data: () => ({}),
  methods: {
    async main() {
      const code = this.$route.query.code;
      const state = this.$route.query.state;
      try {
        await this.$store.dispatch("obtainToken", {
          code,
          state,
          apolloClient: this.$apollo,
        });
        await this.$store.dispatch("loadGitHubUser", this.$apollo);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "SignInError" });
      }
      this.$store.dispatch("snackbarMessage", "Signed in");
      this.$router.push({ name: "Dashboard" });
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.error) {
      next({ name: "SignInError" });
    } else if (!to.query.code) {
      next({ path: "/" });
    } else {
      next();
    }
  },
  mounted: async function () {
    this.main();
  },
};
</script>
