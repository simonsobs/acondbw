import {
  signIn,
  signOut,
  restoreFromLocalStorage,
  isSignedIn,
} from "@/utils/auth.js";

function createInitialState() {
  try {
    const {
      token,
      gitHubViewer,
      isSignedIn,
      isAdmin,
    } = restoreFromLocalStorage();
    return {
      token,
      githubUser: gitHubViewer,
      isSignedIn,
      isAdmin,
    };
  } catch (error) {
    return { token: null, githubUser: null, isSignedIn: false, isAdmin: false };
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
    set_sign_in_info(state, obj) {
      state.githubUser = obj.gitHubViewer;
      state.isSignedIn = obj.isSignedIn;
      state.isAdmin = obj.isAdmin;
    },
    reset_sign_in_info(state) {
      state.githubUser = null;
      state.isSignedIn = false;
      state.isAdmin = false;
    },
    set_last_error(state, error) {
      state.lastError = error;
    },
    clear_last_error(state) {
      state.lastError = null;
    },
  },
  actions: {
    async checkIfSignedIn({ commit, dispatch }, apolloClient) {
      try {
        const result = await isSignedIn(apolloClient);
        if (result) {
          commit("set_sign_in_info", result);
          return;
        }
      } catch (error) {
      }
      dispatch("signOut", apolloClient);
    },
    async signOut({ commit }, apolloClient) {
      commit("reset_sign_in_info");
      commit("set_token", null);
      await signOut(apolloClient);
    },
    async signIn({ commit, dispatch }, { code, state, apolloClient }) {
      commit("clear_last_error");
      try {
        const { token, signInInfo } = await signIn(code, state, apolloClient);
        commit("set_token", token);
        commit("set_sign_in_info", signInInfo);
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
