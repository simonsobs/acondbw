import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";

import NavigationAdmin from "@/components/admin/NavigationAdmin.vue";
import { createRouter } from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof shallowMount>;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    router = createRouter();
    wrapper = shallowMount(NavigationAdmin, {
      localVue,
      vuetify,
      router,
    });
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
