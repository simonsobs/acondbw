import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import About from "@/views/About.vue";

// The way to setup tests with Vuetify was described here
// https://github.com/vuetifyjs/vuetify/issues/4068#issuecomment-586829171

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("About.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(About, {
      localVue,
    });
  });

  it("test text", () => {
    expect(wrapper.text()).toBe("This is an about page");
  });

  it("test html", () => {
    expect(wrapper.html()).toContain("<h1>This is an about page</h1>");
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
