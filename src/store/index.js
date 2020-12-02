import Vue from "vue";
import Vuex from "vuex";

import { auth } from "./auth";

Vue.use(Vuex);

// Declared as a function to avoid the problem described in
// https://stackoverflow.com/a/59064006/7309855 in the tests.
var state = function () {
  return {
    example: "abc",
    snackbar: false,
    snackbarMessage: null,
    nApolloMutations: 0,
  };
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
  auth,
};

export const storeConfig = {
  state,
  mutations,
  actions,
  modules,
};

const store = new Vuex.Store(storeConfig);
export default store;
