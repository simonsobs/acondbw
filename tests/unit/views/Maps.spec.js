import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Maps from "@/views/Maps.vue";

// import router from "@/router";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("Maps.vue", () => {
  let localVue;
  let vuetify;
  let router;

  function createWrapper(loading = false) {
    return shallowMount(Maps, {
      localVue,
      vuetify,
      router,
      stubs: ["router-link", "router-view"]
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    router = new VueRouter();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

});
