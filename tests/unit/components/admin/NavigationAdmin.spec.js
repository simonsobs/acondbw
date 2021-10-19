import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import NavigationAdmin from "@/components/admin/NavigationAdmin";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
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
