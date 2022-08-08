import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
// import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import SignInCard from "@/components/auth/SignInCard.vue";
import router from "@/router";

import store from "@/store";
jest.mock("@/store");

import { redirectToGitHubAuthURL } from "@/utils/auth";
jest.mock("@/utils/auth");

import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInCard.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;
  let storeAuth;
  let actions;
  // let store_;

  // function createWrapper() {
  //   let wrapper = mount(SignInCard, {
  //     localVue,
  //     router,
  //     vuetify,
  //     store: store_,
  //   });
  //   return wrapper;
  // }

  beforeEach(function () {
    (redirectToGitHubAuthURL as jest.Mock).mockClear();
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    // localVue.use(Vuex);
    vuetify = new Vuetify();
    // actions = {
    //   clearAuthError: jest.fn(),
    // };
    // store_ = new Vuex.Store({
    //   actions,
    // });
    wrapper = mount(SignInCard, {
      localVue,
      router,
      vuetify,
      pinia: createTestingPinia(),
      // store: store_,
    });
    storeAuth = useAuthStore();
    storeAuth.token = "XXXXXXXXXX"; // mock store in "@/src/router/index.ts"

    // store.state = { auth: { token: "XXXXXXXXXX" } }; // mock store in "@/src/router/index.js"
  });

  it("match snapshot", async () => {
    // const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot loading", async () => {
    // const wrapper = createWrapper();
    wrapper.setData({ loading: true });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("signIn success", async () => {
    // const wrapper = createWrapper();
    await Vue.nextTick();
    wrapper.vm.signIn();
    expect(storeAuth.clearAuthError.mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("signIn error", async () => {
    // const wrapper = createWrapper();
    await Vue.nextTick();
    (redirectToGitHubAuthURL as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.signIn();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(storeAuth.clearAuthError.mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();

    // @ts-ignore
    expect(router.history.current.name).toBe("SignInError");
  });
});
