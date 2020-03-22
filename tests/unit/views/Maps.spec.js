
import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Maps from "@/views/Maps.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Maps.vue", () => {
  let localVue;
  let vuetify;

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
  });

  it("match snapshot list", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "MapList"});
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot item", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "MapItem", params: { name: "map001" } });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("transition update", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "MapList"});
    await router.push({ name: "MapItem", params: { name: "map001" } });

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-maps-update');
    // expect(trans_attrs.mode).toBe('out-in');
  });

  it("transition leave", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "MapList"});
    await router.push("/about");

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-maps-leave');
    // expect(trans_attrs.mode).toBe('out-in');
  });

});
