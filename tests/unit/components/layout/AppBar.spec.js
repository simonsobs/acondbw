import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import AppBar from "@/components/layout/AppBar";
import router from "@/router";

jest.mock('vue-apollo');
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let vuetify;

  function createWrapper(loading = false) {
    return shallowMount(AppBar, {
      localVue,
      vuetify,
      router,
      mocks: {
        $apollo: {
          queries: {
            title: {
              loading: loading,
            },
          },
        },
      },
    });
  }

  beforeEach(() => {
    process.env.VUE_APP_GRAPHQL_HTTP = "http://graphql.api:5000/graphql";
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  afterEach(() => {
    process.env = ENV_ORG;
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      title: "Toolbar Title",
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
