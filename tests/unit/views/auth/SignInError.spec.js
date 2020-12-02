import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import SignInError from "@/views/auth/SignInError.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SignInError.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper(store) {
    return shallowMount(SignInError, {
      localVue,
      vuetify,
      store,
    });
  }

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
  });

  it("match snapshot without error", async () => {
    const store = new Vuex.Store({});
    const wrapper = createWrapper(store);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot with error", async () => {
    const store = new Vuex.Store({
      state: {
        auth: {
          lastError: {
            error: "access denied",
            error_description: "The user has denied your application access.",
            error_uri:
              "https://docs.github.com/apps/managing-oauth-apps/troubleshooting-authorization-request-errors/#access-denied",
          },
        },
      },
    });
    const wrapper = createWrapper(store);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
