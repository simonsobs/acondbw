import Vue, { ref } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import { injectionKey } from "@/utils/config";

import AppBar from "@/components/layout/AppBar.vue";
import { createRouter } from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("one", () => {
  // const ENV_ORG = process.env;

  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;

  function createWrapper(loading = false) {
    return shallowMount(AppBar, {
      localVue,
      vuetify,
      router,
      pinia: createTestingPinia(),
      provide: {
        [(injectionKey as any)]: { config: ref({ toolbarTitle: "Toolbar Title" }) },
      },
    });
  }

  beforeEach(() => {
    // process.env.VUE_APP_GRAPHQL_HTTP = "http://graphql.api:5000/graphql";
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
  });

  afterEach(() => {
    // process.env = ENV_ORG;
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
