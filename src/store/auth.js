import { onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";

export const auth = {
  state: {
    token: null,
  },
  mutations: {
    set_token(state, token) {
      state.token = token;
    },
  },
  actions: {
    setTokenFromLocalStorage({ commit }) {
      const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
      if (token) {
        commit("set_token", token);
      }
    },
    async setToken({ commit }, { token, apolloClient }) {
      await onLogin(apolloClient, token);
      commit("set_token", token);
    },
    async unsetToken({ commit }, apolloClient) {
      await onLogout(apolloClient);
      commit("set_token", null);
    },
  },
};
