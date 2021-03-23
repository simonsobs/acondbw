import {
  signIn,
  signOut,
  restoreFromLocalStorage,
  isSignedIn,
} from "@/utils/auth.js";

function createInitialState() {
  try {
    const { token, gitHubViewer } = restoreFromLocalStorage();
    return { token, githubUser: gitHubViewer };
  } catch (error) {
    return { token: null, githubUser: null };
  }
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
    async checkIfSignedIn({ dispatch }, apolloClient) {
      try {
        const result = await isSignedIn(apolloClient);
        if (result) return;
      } catch {}
      dispatch("signOut", apolloClient);
    },
    async signOut({ commit }, apolloClient) {
      commit("set_github_user", null);
      commit("set_token", null);
      await signOut(apolloClient);
    },
    async signIn({ commit, dispatch }, { code, state, apolloClient }) {
      commit("clear_last_error");
      try {
        const { token, gitHubViewer } = await signIn(code, state, apolloClient);
        commit("set_token", token);
        commit("set_github_user", gitHubViewer);
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
