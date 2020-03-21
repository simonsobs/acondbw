import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Beams from "@/views/Beams.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Beams.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper(loading = false) {
    return shallowMount(Beams, {
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
    await router.push({ name: "BeamList"});
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot item", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "BeamItem", params: { name: "beam001" } });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("transition update", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "BeamList"});
    await router.push({ name: "BeamItem", params: { name: "beam001" } });

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-beams-slow');
    // expect(trans_attrs.mode).toBe('out-in');
  });

  it("transition leave", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "BeamList"});
    await router.push("/about");

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-beams-slow');
    // expect(trans_attrs.mode).toBe('out-in');
  });

});
