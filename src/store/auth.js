import { apolloClient, onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
import GitHubViewer from "@/graphql/queries/GitHubViewer.gql";
import { exchangeCodeForToken } from "@/utils/auth.js";

function createInitialState() {
  let token;
  let githubUser;

  try {
    token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
    githubUser = JSON.parse(localStorage.getItem("github-user"));

    if (!((token && githubUser) || (!token && !githubUser))) {
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem("github-user");
      token = null;
      githubUser = null;
    }
  } catch (error) {
    localStorage.clear();
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
  state: function () {
    const initialState = createInitialState();
    return {
      ...initialState,
      lastError: null,
    };
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
    async obtainToken({ commit, dispatch }, { code, state, apolloClient }) {
      commit("clear_last_error");
      try {
        const token = await exchangeCodeForToken(code, state, apolloClient);
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
        const { data } = await apolloClient.query({ query: GitHubViewer });
        const githubUser = data.gitHubViewer;
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
