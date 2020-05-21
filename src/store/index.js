import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  example: "abc",
};

const mutations = {
  set_example(state, example) {
    state.example = example;
  },
};

const actions = {
  loadExample({ commit }) {
    const example = "123";
    commit("set_example", example);
  },
};

export const storeConfig = {
  state,
  mutations,
  actions,
};

export default new Vuex.Store(storeConfig);
