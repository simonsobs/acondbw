import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import About from "@/views/framework/About.vue";

Vue.use(Vuetify);

describe("About.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = mount(About, {
      localVue,
    });
    wrapper.setData({
      version: "0.0.1.test",
    });
  });

  it("test text", () => {
    const text = wrapper
      .text()
      .trim()
      .replace(/[\n\r]+/g, " ") // remove line breaks
      .replace(/ +/g, " "); // remove multiple consecutive spaces
    expect(text).toBe("This is an about page Server version: 0.0.1.test");
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
