import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import MapItemCard from "@/components/MapItemCard.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("MapItemCard.vue", () => {
  function createWrapper({ propsData } = {}) {
    return mount(MapItemCard, {
      localVue,
      router,
      propsData: {
        map: {
          name: "map123456",
          datePosted: "2020-01-31",
          mapper: "XYZ",
          mapFilePaths: { edges: [] },
          note: "",
          beams: { edges: [] }
        },
        ...propsData
      }
    });
  }

  it("match snapshot", () => {
    const wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ])(
    "match snapshot - {collapsible: %p, collapsed: %p}",
    (collapsible, collapsed) => {
      const wrapper = createWrapper({
        propsData: { collapsed: collapsed, collapsible: collapsible }
      });
      expect(wrapper.html()).toMatchSnapshot();
    }
  );
});
