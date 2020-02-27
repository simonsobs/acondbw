
import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";

import MapItemCard from "@/components/MapItemCard.vue";

// The way to setup tests with Vuetify was described here
// https://github.com/vuetifyjs/vuetify/issues/4068#issuecomment-586829171

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("MapItemCard.vue", () => {
  let vuetify;
  let wrapper;
  beforeEach(() => {
    vuetify = new Vuetify();

    wrapper = shallowMount(MapItemCard, {
      localVue,
      vuetify,
      propsData: {
        map: {
          name: "map123456",
          datePosted: "2020-01-31",
          mapper: "XYZ",
          mapFilePaths: { edges: [] },
          note: "",
          beams: { edges: [] }
        }
      }
    });
  });

  it("example test", () => {
    console.log(wrapper.text());
  });
});
