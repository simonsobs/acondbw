import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue";
import router from "@/router";

import { onRedirectedBack } from "@/utils/auth";
jest.mock("@/utils/auth");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("OAuthRedirect.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let pinia: ReturnType<typeof createTestingPinia>;

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
    (onRedirectedBack as jest.Mock).mockClear();
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    pinia = createTestingPinia();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("onRedirectedBack()", async () => {
    createWrapper();
    expect(onRedirectedBack).toHaveBeenCalled();
  });
});
