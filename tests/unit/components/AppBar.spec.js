import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import AppBar from "@/components/AppBar";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    process.env.VUE_APP_TOOLBAR_TITLE = "Product DB Title";
    process.env.VUE_APP_GRAPHQL_HTTP = "http://graphql.api:5000/graphql";
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = shallowMount(AppBar, {
      localVue,
      vuetify,
      router,
    });
  });

  afterEach(() => {
    process.env = ENV_ORG;
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

});
