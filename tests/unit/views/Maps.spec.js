import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import Maps from "@/views/Maps.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Maps.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(Maps, {
      localVue,
      router,
      stubs: {
        MapList: true
      }
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

});
