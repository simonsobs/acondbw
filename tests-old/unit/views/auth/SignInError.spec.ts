import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import SignInError from "@/views/auth/SignInError.vue";

import { useAuthStore } from "@/plugins/pinia/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInError.vue", () => {
  let localVue;
  let vuetify;
  let pinia;
  let authStore;

  function createWrapper() {
    return shallowMount(SignInError, {
      localVue,
      pinia,
      vuetify,
    });
  }

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    pinia = createTestingPinia();
    vuetify = new Vuetify();
    authStore = useAuthStore(pinia);
  });

  it("match snapshot without error", async () => {
    const wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot with error", async () => {
    const wrapper = createWrapper();
    authStore.lastError= {
            error: "access denied",
            error_description: "The user has denied your application access.",
            error_uri:
              "https://docs.github.com/apps/managing-oauth-apps/troubleshooting-authorization-request-errors/#access-denied",
          }
    expect(wrapper.html()).toMatchSnapshot();
  });
});
