import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue";
import router from "@/router";

import { useAuthStore } from "@/stores/auth";

import { validateState } from "@/utils/auth";
jest.mock("@/utils/auth");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("OAuthRedirect.vue", () => {
  let localVue;
  let vuetify;
  let pinia;
  let authStore;

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
      pinia,
      vuetify,
    });
    return wrapper;
  }

  beforeEach(function () {
    (validateState as jest.Mock).mockClear();
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    pinia = createTestingPinia();
    authStore = useAuthStore(pinia);

    authStore.token = null;

    (validateState as jest.Mock).mockImplementation(() => {
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

    // @ts-ignore
    expect(router.history.current.name).toBe("Auth");

    // @ts-ignore
    expect(router.history.current.query).toEqual(query);
  });

  it("error no query", async () => {
    await router.push({ name: "OAuthRedirect", query: {} });
    const wrapper = createWrapper();
    await Vue.nextTick();

    // @ts-ignore
    expect(router.history.current.path).toBe("/");
  });

  it("error invalid state", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    (validateState as jest.Mock).mockImplementation(() => {
      return false;
    });
    const wrapper = createWrapper();
    await Vue.nextTick();

    // @ts-ignore
    expect(router.history.current.path).toBe("/");
  });
});
