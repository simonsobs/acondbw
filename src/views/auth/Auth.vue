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
    async exchangeCodeForToken(code) {
      try {
        const state = this.$route.query.state;
        await this.$store.dispatch("obtainToken", {
          code,
          state,
          apolloClient: this.$apollo,
        });
        await this.$store.dispatch("loadGitHubUser", this.$apollo);
        this.$store.dispatch("snackbarMessage", "Signed in");
        this.$router.push({ name: "Dashboard" });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
      }
    },
  },
  computed: {
    token() {
      return this.$store.state.auth.token;
    },
    code() {
      return this.$route.query.code;
    },
    authorizationError() {
      return this.$route.query.error ? true : false;
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
  watch: {
    code: {
      handler: async function () {
        if (!this.code) {
          return;
        }

        try {
          this.exchangeCodeForToken(this.code);
        } catch (error) {
          this.$router.push({ name: "SignInError" });
        }
      },
      immediate: true,
    },
    authorizationError: {
      handler: function () {
        if (this.authorizationError) {
          this.$router.push({ name: "SignInError" });
        }
      },
      immediate: true,
    },
  },
};
</script>
