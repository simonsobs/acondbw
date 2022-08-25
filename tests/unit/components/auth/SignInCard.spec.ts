import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import SignInCard from "@/components/auth/SignInCard.vue";
import { createRouter } from "@/router";

import { redirectToGitHubAuthURL } from "@/utils/auth/oauth";
jest.mock("@/utils/auth/oauth");

import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInCard.vue", () => {
  let storeAuth: ReturnType<typeof useAuthStore>;

  beforeEach(function () {
    (redirectToGitHubAuthURL as jest.Mock).mockClear();
  });

  function createWrapper() {
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

  it("signIn success", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    wrapper.vm.signIn();
    expect((storeAuth.clearAuthError as jest.Mock).mock.calls.length).toBe(1);
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
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(wrapper.vm.$router.currentRoute.name).toBe("SignInError");
  });
});
