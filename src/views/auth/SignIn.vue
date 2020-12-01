<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        v-if="loading"
        indeterminate
        :size="18"
        :width="3"
        color="grey"
      ></v-progress-circular>
      <v-card v-else-if="user" flat>
        <v-list-item>
          <v-list-item-content>Signed in with GitHub!</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-card outlined>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="user.avatarUrl" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{
                  user.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.login }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon left>mdi-github</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-card>
        </v-list-item>
      </v-card>
      <v-card flat v-else>
        <v-card-title>Sign In</v-card-title>
        <v-card-actions>
          <v-btn block outlined @click="signIn">
            <v-icon left>mdi-github</v-icon>Sign In with GitHub
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SignIn",
  data: () => ({
    signingIn: false,
  }),
  methods: {
    async signIn() {
      this.signingIn = true;
      try {
        await this.$store.dispatch("requestAuth", {
          window,
          apolloClient: this.$apollo,
        });
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "SignInError" });
      }
    },
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
        this.$router.push({ name: "SignIn" });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
      }
    },
  },
  computed: {
    token() {
      return this.$store.state.auth.token;
    },
    githubUser() {
      return this.$store.state.auth.githubUser;
    },
    user() {
      if (!this.token) {
        return null;
      } else if (!this.githubUser) {
        return null;
      } else {
        return this.githubUser;
      }
    },
    code() {
      return this.$route.query.code;
    },
    authorizationError() {
      return this.$route.query.error ? true : false;
    },
    loading() {
      if (this.code) {
        return true;
      } else if (this.token && !this.user) {
        return true;
      } else if (this.signingIn) {
        return true;
      } else {
        return false;
      }
    },
    pathToSignIn() {
      return this.$router.resolve({ name: "SignIn" }).route.path;
      // i.e., "/signin"
    },
  },
  watch: {
    code: {
      handler: async function () {
        if (!this.code) {
          return;
        }

        if (!this.$route.path == this.pathToSignIn) {
          this.$router.push({ name: "SignInError" });
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
