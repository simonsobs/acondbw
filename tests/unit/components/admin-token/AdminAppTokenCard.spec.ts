import { Mock } from "vitest";
import Vue, { nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import AdminAppTokenCard from "@/components/admin-token/AdminAppTokenCard.vue";
import { createRouter } from "@/router";

import { redirectToGitHubAuthURL } from "@/utils/auth/oauth";
vi.mock("@/utils/auth/oauth");

import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("AdminAppTokenCard.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: any;
  let storeAuth: ReturnType<typeof useAuthStore>;

  beforeEach(function () {
    (redirectToGitHubAuthURL as Mock).mockClear();
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
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
    // await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot loading", async () => {
    wrapper.setData({ loading: true });
    // await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("requestAuth success", async () => {
    // await nextTick();
    wrapper.vm.requestAuth();
    expect((storeAuth.clearAuthError as Mock).mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("requestAuth error", async () => {
    // await nextTick();
    (redirectToGitHubAuthURL as Mock).mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.requestAuth();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect((storeAuth.clearAuthError as Mock).mock.calls.length).toBe(1);
    expect((redirectToGitHubAuthURL as Mock).mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(router.currentRoute.name).toBe("AdminAppTokenError");
  });
});
