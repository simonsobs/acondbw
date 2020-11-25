import Vue from "vue";
import Vuex from "vuex";
import { onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";

Vue.use(Vuex);

const auth = {
  state: {
    token: null,
  },
  mutations: {
    set_token(state, token) {
      state.token = token;
    },
  },
  actions:{
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
  }
}

const state = {
  example: "abc",
  snackbar: false,
  snackbarMessage: null,
  nApolloMutations: 0,
};

const mutations = {
  set_example(state, example) {
    state.example = example;
  },
  set_snackbar_message(state, message) {
    state.snackbarMessage = message;
    state.snackbar = true;
  },
  set_snackbar(state, snackbar) {
    state.snackbar = snackbar;
  },
  apollo_mutation_called(state) {
    state.nApolloMutations++;
  },
};

const actions = {
  loadExample({ commit }) {
    const example = "123";
    commit("set_example", example);
  },
  snackbarMessage({ commit }, message) {
    commit("set_snackbar_message", message);
  },
  closeSnackbar({ commit }) {
    commit("set_snackbar", false);
  },
  apolloMutationCalled({ commit }) {
    commit("apollo_mutation_called");
  },
};

const modules = {
  auth
}

export const storeConfig = {
  state,
  mutations,
  actions,
  modules
};

const store = new Vuex.Store(storeConfig)
export default store;

store.dispatch("setTokenFromLocalStorage");
