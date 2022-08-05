import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import SignInCard from "@/components/auth/SignInCard.vue";
import router from "@/router";

import store from "@/store";
jest.mock("@/store");

import { redirectToGitHubAuthURL } from "@/utils/auth";
jest.mock("@/utils/auth");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInCard.vue", () => {
  let localVue;
  let vuetify;
  let actions;
  let store_;

  function createWrapper() {
    let wrapper = mount(SignInCard, {
      localVue,
      router,
      vuetify,
      store: store_,
    });
    return wrapper;
  }

  beforeEach(function () {
    redirectToGitHubAuthURL.mockClear();
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
    actions = {
      clearAuthError: jest.fn(),
    };
    store_ = new Vuex.Store({
      actions,
    });

    store.state = { auth : { token : "XXXXXXXXXX" } }; // mock store in "@/src/router/index.js"
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot loading", async () => {
    const wrapper = createWrapper();
    wrapper.setData({ loading: true });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("signIn success", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    wrapper.vm.signIn();
    expect(actions.clearAuthError.mock.calls.length).toBe(1);
    expect(redirectToGitHubAuthURL.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("signIn error", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    redirectToGitHubAuthURL.mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.signIn();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(actions.clearAuthError.mock.calls.length).toBe(1);
    expect(redirectToGitHubAuthURL.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(router.history.current.name).toBe("SignInError");
  });
});
