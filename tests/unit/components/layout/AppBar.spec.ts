import Vue, { ref } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import AppBar from "@/components/layout/AppBar.vue";
import { createRouter } from "@/router";

import { useConfigStore } from "@/stores/config";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("one", () => {
  // const ENV_ORG = process.env;

  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;

  function createWrapper(loading = false) {
    const pinia = createTestingPinia();
    const configStore = useConfigStore(pinia);
    configStore.config.toolbarTitle = "Toolbar Title";
    return shallowMount(AppBar, {
      localVue,
      vuetify,
      router,
      pinia,
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
