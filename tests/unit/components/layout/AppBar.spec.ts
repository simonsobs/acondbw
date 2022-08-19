import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import AppBar from "@/components/layout/AppBar.vue";
import { createRouter } from "@/router";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  const ENV_ORG = process.env;

  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;

  function createWrapper(loading = false) {
    return shallowMount(AppBar, {
      localVue,
      vuetify,
      router,
      pinia: createTestingPinia(),
      mocks: {
        $store: {
          state: {
            webConfig: {
              toolbarTitle: "Toolbar Title",
            },
          },
        },
      },
    });
  }

  beforeEach(() => {
    process.env.VUE_APP_GRAPHQL_HTTP = "http://graphql.api:5000/graphql";
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
  });

  afterEach(() => {
    process.env = ENV_ORG;
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
