import { onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";

function createInitialState() {
  const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
  const ret = {
    token: token
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
  },
  actions: {
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
