import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import AdminAppTokenCard from "@/components/admin-token/AdminAppTokenCard.vue";
import router from "@/router";

import { redirectToGitHubAuthURL } from "@/utils/auth";
jest.mock("@/utils/auth");

import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("AdminAppTokenCard.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;
  let storeAuth;

  beforeEach(function () {
    (redirectToGitHubAuthURL as jest.Mock).mockClear();
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    wrapper = mount(AdminAppTokenCard, {
      localVue,
      router,
      vuetify,
      pinia: createTestingPinia(),
    });

    storeAuth = useAuthStore();

    storeAuth.token = "XXXXXXXXXX"; // mock store in "@/src/router/index.ts"
  });

  it("match snapshot", async () => {
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot loading", async () => {
    wrapper.setData({ loading: true });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("requestAuth success", async () => {
    await Vue.nextTick();
    wrapper.vm.requestAuth();
    expect(storeAuth.clearAuthError.mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("requestAuth error", async () => {
    await Vue.nextTick();
    (redirectToGitHubAuthURL as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.requestAuth();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(storeAuth.clearAuthError.mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as jest.Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();

    // https://github.com/vuejs/vue-router/issues/2157#issuecomment-543973283
    // @ts-ignore
    expect(router.history.current.name).toBe("AdminAppTokenError");
  });
});
