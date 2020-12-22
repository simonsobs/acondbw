import { apolloClient, onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");
import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";
import AuthenticateWithGitHub from "@/graphql/auth/AuthenticateWithGitHub.gql";
import GitHubUser from "@/graphql/auth/GitHubUser.gql";

function createInitialState() {
  // localStorage.removeItem(AUTH_TOKEN);
  // localStorage.removeItem("github-user");
  // localStorage.removeItem("auth-state");
  let token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
  let githubUser = JSON.parse(localStorage.getItem("github-user"));

  if (!((token && githubUser) || (!token && !githubUser))) {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem("github-user");
    token = null;
    githubUser = null;
  }

  const ret = {
    token: token,
    githubUser: githubUser,
  };
  return ret;
}


export const auth = {
  state: function() {
    const initialState = createInitialState();
    return {
      ...initialState,
      lastError: null,
    }
  },
  mutations: {
    set_token(state, token) {
      state.token = token;
    },
    set_github_user(state, githubUser) {
      state.githubUser = githubUser;
    },
    set_last_error(state, error) {
      state.lastError = error;
    },
    clear_last_error(state) {
      state.lastError = null;
    },
  },
  actions: {
    async signOut({ commit }, apolloClient) {
      localStorage.removeItem("github-user");
      commit("set_github_user", null);
      await onLogout(apolloClient);
      commit("set_token", null);
    },
    async requestAuth({ commit }, { window, apolloClient }) {
      commit("clear_last_error");
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
    async obtainToken({ commit, dispatch }, { code, state, apolloClient }) {
      commit("clear_last_error");
      try {
        const authState = JSON.parse(localStorage.getItem("auth-state"));
        if (!authState) {
          throw new Error("A state was not stored.");
        }
        if (!state) {
          throw new Error("A state was not returned.");
        }
        if (!(authState == state)) {
          throw new Error("The state did not match.");
        }
        const { data } = await apolloClient.mutate({
          mutation: AuthenticateWithGitHub,
          variables: { code: code },
        });
        const authPayload = data.authenticateWithGitHub.authPayload;
        const token = JSON.stringify(authPayload.token);
        await onLogin(apolloClient, token);
        commit("set_token", token);
      } catch (error) {
        dispatch("signOut", apolloClient);
        throw error;
      }
    },
    async loadGitHubUser({ commit, dispatch }, apolloClient) {
      commit("clear_last_error");
      // await onLogout(apolloClient);
      // localStorage.removeItem(AUTH_TOKEN);
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
    setRequestAuthError({ commit }, query) {
      const error = (({ error, error_description, error_uri }) => ({
        error,
        error_description,
        error_uri,
      }))(query);
      commit("set_last_error", error);
    },
    clearAuthError({ commit }) {
      commit("clear_last_error");
    },
  },
};
