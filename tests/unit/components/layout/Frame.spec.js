import Vue from "vue";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Frame from "@/components/layout/Frame";

Vue.use(Vuetify);

describe("Frame.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = shallowMount(Frame, {
      localVue,
      vuetify,
    });
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
