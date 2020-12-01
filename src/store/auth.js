import { onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");
import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";
import GitHubAuth from "@/graphql/auth/GitHubAuth.gql";
import GitHubUser from "@/graphql/auth/GitHubUser.gql";

function createInitialState() {
  const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
  const githubUser = JSON.parse(localStorage.getItem("github-user"));
  const ret = {
    token: token,
    githubUser: githubUser
  }
  return ret;
}

const initialState = createInitialState();

export const auth = {
  state: initialState,
  mutations: {
    set_token(state, token) {
      state.token = token;
    },
    set_github_user(state, githubUser) {
      state.githubUser = githubUser;
    }
  },
  actions: {
    async signOut({ commit }, apolloClient) {
      localStorage.removeItem("github-user");
      commit("set_github_user", null);
      await onLogout(apolloClient);
      commit("set_token", null);
    },
    async requestAuth({ commit }, { window, apolloClient }) {
      try {
        const { data } = await apolloClient.query({ query: OAuthAppInfo });
        const oauthAppInfo = data.oauthAppInfo;
        const state = cryptoRandomString({ length: 16, type: "url-safe" });
        localStorage.setItem("auth-state", JSON.stringify(state));
        const params = {
          response_type: "code",
          client_id: oauthAppInfo.clientId,
          redirect_uri: oauthAppInfo.redirectUri,
          scope: "", // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
          state: state,
        };
        let queryString = querystring.stringify(params);
        const uri = oauthAppInfo.authorizeUrl + "?" + queryString;
        window.location.href = uri;
      } catch (error) {
        localStorage.removeItem("auth-state");
        throw error;
      }
    },
    async obtainToken({ commit, dispatch }, { code, apolloClient }) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: GitHubAuth,
          variables: { code: code },
        });
        const authPayload = data.githubAuth.authPayload;
        const token = JSON.stringify(authPayload.token);
        await onLogin(apolloClient, token);
        commit("set_token", token);
        } catch (error) {
        console.log(error);
        dispatch("signOut", apolloClient);
        throw error;
      }
    },
    async loadGitHubUser({ commit, dispatch }, apolloClient) {
      try {
        const { data } = await apolloClient.query({ query: GitHubUser });
        const githubUser = data.githubUser;
        localStorage.setItem("github-user", JSON.stringify(githubUser));
        commit("set_github_user", githubUser);
      } catch (error) {
        dispatch("signOut", apolloClient);
        throw error;
      }
    },
  },
};
