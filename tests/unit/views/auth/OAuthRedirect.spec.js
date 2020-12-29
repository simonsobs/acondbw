import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue";
import router from "@/router";

import store from "@/store";
jest.mock("@/store");

import { validateState } from "@/utils/auth.js";
jest.mock("@/utils/auth.js");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("OAuthRedirect.vue", () => {
  let localVue;
  let vuetify;
  let actions;
  let store_;

  const callbackRoute = { name: "Auth" };
  const state = btoa(
    JSON.stringify({
      redirect: callbackRoute,
      code: "XXXXXXXX",
    })
  );
  const query = { state: state };

  function createWrapper() {
    let wrapper = mount(OAuthRedirect, {
      localVue,
      router,
      vuetify,
      store: store_,
    });
    return wrapper;
  }

  beforeEach(function () {
    validateState.mockClear();
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
    actions = {};
    store_ = new Vuex.Store({
      actions,
    });

    store.state = { auth: { token: null } }; // mock store in "@/src/router/index.js"

    validateState.mockImplementation(() => {
      return true;
    });
  });

  it("match snapshot", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("success", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(router.history.current.name).toBe("Auth");
    expect(router.history.current.query).toEqual(query);
  });

  it("error no query", async () => {
    await router.push({ name: "OAuthRedirect", query: {} });
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(router.history.current.path).toBe("/");
  });

  it("error invalid state", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    validateState.mockImplementation(() => {
      return false;
    });
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(router.history.current.path).toBe("/");
  });
});
