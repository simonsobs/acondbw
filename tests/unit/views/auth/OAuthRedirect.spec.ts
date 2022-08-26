import { jest } from "@jest/globals";
import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue";
import { createRouter } from "@/router";

import { validateAndDecodeState, UnencodedState } from "@/utils/auth/oauth";
jest.mock("@/utils/auth/oauth");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("OAuthRedirect.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let router: ReturnType<typeof createRouter>;

  const callbackRoute = { name: "Auth" };
  const rawState: UnencodedState = {
    redirect: callbackRoute,
    option: JSON.stringify({
      path: { name: "Dashboard" },
      randomString: "xjyls",
    }),
  };
  const state = btoa(JSON.stringify(rawState));
  const query = { state: state };

  function createWrapper() {
    return shallowMount(OAuthRedirect, {
      localVue,
      router,
      pinia: createTestingPinia(),
      vuetify: new Vuetify(),
    });
  }

  beforeEach(() => {
    (validateAndDecodeState as jest.Mock).mockReturnValue(rawState);
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    router = createRouter();
  });

  afterEach(() => {
    (validateAndDecodeState as jest.Mock).mockClear();
  });

  it("match snapshot", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    const wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("success", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    createWrapper();
    expect(router.currentRoute.name).toBe("Auth");
    expect(router.currentRoute.query).toEqual(query);
  });

  it("failure", async () => {
    (validateAndDecodeState as jest.Mock).mockReturnValue(null);
    await router.push({ name: "OAuthRedirect", query: query });
    createWrapper();
    expect(router.currentRoute.name).toBe("Entry");
  });
});
