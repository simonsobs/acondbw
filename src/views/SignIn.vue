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
import axios from "axios";
import { report } from "process";

const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import GitHubAuth from "@/graphql/GitHubAuth.gql";
import GitHubUsername from "@/graphql/GitHubUsername.gql";

export default {
  name: "SignIn",
  data: () => ({
    githubClientID: "1ce266dd301a653ca64f",
    authorizeURL: "https://github.com/login/oauth/authorize",
    tokenURL: "https://github.com/login/oauth/access_token",
    redirectURI: "http://localhost:8081/signin",
    githubUsername: null,
    signingIn: false
  }),
  apollo: {
    githubUsername: {
      query: GitHubUsername,
      variables() {
        return {
          token: this.token
        };
      },
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
        client_id: this.githubClientID,
        redirect_uri: this.redirectURI,
        scope: "", // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        state: state
      };
      let queryString = querystring.stringify(params);
      const uri = this.authorizeURL + "?" + queryString;
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
    },
    tryAgain() {
      this.$router.push({ name: "SignIn" });
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
      if (this.code) {
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
          return;
        }

        if (!localStorage.signInState) {
          // error
          return;
        }

        if (!this.$route.query.state) {
          // error
          return;
        }

        if (!localStorage.signInState == this.$route.query.state) {
          // error
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
