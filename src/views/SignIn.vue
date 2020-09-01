<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card>
        <v-card-title>Sign In</v-card-title>
        <v-card-actions>
          <v-btn block outlined @click="signIn">
            <v-icon left>mdi-github</v-icon>Sign In with GitHub
          </v-btn>
        </v-card-actions>
        <pre>{{ $route.query }}</pre>
        <pre>{{ token }}</pre>
        <pre>{{ user }}</pre>
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

export default {
  name: "SignIn",
  data: () => ({
    githubClientID: "1ce266dd301a653ca64f",
    authorizeURL: "https://github.com/login/oauth/authorize",
    tokenURL: "https://github.com/login/oauth/access_token",
    redirectURI: "http://localhost:8081/signin",
    token: null,
    user: null
  }),
  methods: {
    signIn() {
      console.log("Sign In");
      console.log(this.$route);
      const state = cryptoRandomString({ length: 16, type: "url-safe" });
      localStorage.signInState = state;
      const params = {
        response_type: "code",
        client_id: this.githubClientID,
        redirect_uri: this.redirectURI,
        scope: "user",
        state: state
      };
      let queryString = querystring.stringify(params);
      console.log(queryString);
      const uri = this.authorizeURL + "?" + queryString;
      console.log(uri);
      window.location.href = uri;
    }
  },
  computed: {
    pathToSignIn() {
      return this.$router.resolve({ name: "SignIn" }).route.path;
      // i.e., "/signin"
    }
  },
  watch: {
    "$route.query.code": {
      handler: async function() {
        console.log(localStorage);
        if (!this.$route.query.code) {
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

        console.log("code!!");
        console.log(this.$route.query);

        const data = await this.$apollo.mutate({
          mutation: GitHubAuth,
          variables: { code: this.$route.query.code }
        });
        console.log(data);
        const authPayload = data.data.githubAuth.authPayload;
        this.token = authPayload.token;
        this.user = authPayload.user;
      },
      immediate: true
    }
  }
};
</script>
