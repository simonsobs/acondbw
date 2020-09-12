<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular v-if="loading" indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
      <div v-else-if="username">Signed in as {{ username }}</div>
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
const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";
import GitHubAuth from "@/graphql/auth/GitHubAuth.gql";
import GitHubUsername from "@/graphql/auth/GitHubUsername.gql";

export default {
  name: "SignIn",
  data: () => ({
    oauthAppInfo: null,
    githubUsername: null,
    signingIn: false
  }),
  apollo: {
    oauthAppInfo: {
      query: OAuthAppInfo
    },
    githubUsername: {
      query: GitHubUsername,
      skip: function() {
        return !this.token;
      },
      result(result) {
        if (!result.data.githubUsername) {
          this.$store.dispatch("unsetToken");
          return;
        }
      }
    }
  },
  methods: {
    signIn() {
      this.signingIn = true;
      const state = cryptoRandomString({ length: 16, type: "url-safe" });
      localStorage.signInState = state;
      const params = {
        response_type: "code",
        client_id: this.oauthAppInfo.clientId,
        redirect_uri: this.oauthAppInfo.redirectUri,
        scope: "", // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        state: state
      };
      let queryString = querystring.stringify(params);
      const uri = this.oauthAppInfo.authorizeUrl + "?" + queryString;
      window.location.href = uri;
    },
    async exchangeCodeForToken(code) {
      try {
        const data = await this.$apollo.mutate({
          mutation: GitHubAuth,
          variables: { code: code }
        });
        const authPayload = data.data.githubAuth.authPayload;
        const token = JSON.stringify("token " + authPayload.token);
        this.$store.dispatch("setToken", { token, apolloClient: this.$apollo });
        this.$store.dispatch("snackbarMessage", "Signed in");
        this.$router.push({ name: "SignIn" });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    username() {
      if (!this.token) {
        return null;
      } else if (!this.githubUsername) {
        return null;
      } else {
        return this.githubUsername;
      }
    },
    code() {
      return this.$route.query.code;
    },
    authorizationError() {
      return this.$route.query.error ? true : false;
    },
    loading() {
      if (!this.oauthAppInfo) {
        return true;
      } else if (this.code) {
        return true;
      } else if (this.token && !this.username) {
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
    }
  },
  watch: {
    code: {
      handler: async function() {
        if (!this.code) {
          return;
        }

        if (!this.$route.path == this.pathToSignIn) {
          this.$router.push({ name: "SignInError" });
          return;
        }

        if (!localStorage.signInState) {
          this.$router.push({ name: "SignInError" });
          return;
        }

        if (!this.$route.query.state) {
          this.$router.push({ name: "SignInError" });
          return;
        }

        if (!(localStorage.signInState == this.$route.query.state)) {
          this.$router.push({ name: "SignInError" });
          return;
        }

        this.exchangeCodeForToken(this.code);
      },
      immediate: true
    },
    authorizationError: {
      handler: function() {
        if (this.authorizationError) {
          this.$router.push({ name: "SignInError" });
        }
      },
      immediate: true
    }
  }
};
</script>
