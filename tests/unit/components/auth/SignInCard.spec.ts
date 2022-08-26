import { jest } from "@jest/globals";
import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import SignInCard from "@/components/auth/SignInCard.vue";
import { createRouter } from "@/router";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
} from "@/utils/auth/oauth";
jest.mock("@/utils/auth/oauth");

import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInCard.vue", () => {
  let storeAuth: ReturnType<typeof useAuthStore>;
  const randomNumber = 0.123456789;
  const randomString = "xjyls"; // (randomNumber + 1).toString(36).substring(7);

  beforeEach(function () {
    jest.spyOn(window.Math, "random").mockReturnValue(randomNumber);
  });

  afterEach(() => {
    (redirectToGitHubAuthURL as jest.Mock).mockClear();
    (encodeAndStoreState as jest.Mock).mockClear();
    jest.spyOn(window.Math, "random").mockRestore();
  });

  function createWrapper(propsData = {}): any {
    const localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    const pinia = createTestingPinia();
    storeAuth = useAuthStore();
    storeAuth.token = "XXXXXXXXXX"; // mock store in "@/src/router/index.ts"
    return shallowMount(SignInCard, {
      localVue,
      router: createRouter(),
      vuetify: new Vuetify(),
      pinia,
      propsData,
    });
  }

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

  it("computed", async () => {
    const path = "/product/map/";
    const wrapper = createWrapper({ path });
    await Vue.nextTick();
    const expectedRawState = {
      redirect: { name: "Auth" },
      option: JSON.stringify({
        path,
        randomString,
      }),
    };
    expect(wrapper.vm.rawState).toEqual(expectedRawState);
  });

  it("computed - default props", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    const expectedRawState = {
      redirect: { name: "Auth" },
      option: JSON.stringify({
        path: { name: "Dashboard" },
        randomString,
      }),
    };
    expect(wrapper.vm.rawState).toEqual(expectedRawState);
  });

  it("signIn success", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    wrapper.vm.signIn();
    expect((storeAuth.clearAuthError as jest.Mock).mock.calls.length).toBe(1);
    expect((encodeAndStoreState as jest.Mock).mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("signIn error", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    (redirectToGitHubAuthURL as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.signIn();
    await Vue.nextTick();
    await Vue.nextTick();
    expect((storeAuth.clearAuthError as jest.Mock).mock.calls.length).toBe(1);
    expect((encodeAndStoreState as jest.Mock).mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(wrapper.vm.$router.currentRoute.name).toBe("SignInError");
  });
});
