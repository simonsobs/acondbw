import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import MapItem from "@/views/MapItem.vue";
import MapItemCard from "@/components/MapItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("MapItem.vue", () => {
  let localVue;

  function createWrapper() {
    return mount(MapItem, {
      localVue,
      router,
      mocks: {},
      stubs: {
        MapItemCard: true
      }
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();

    wrapper.setData({
      map: {
        mapId: "1013",
        name: "lat20200201",
      }
    });
    await Vue.nextTick();
    expect(wrapper.find(MapItemCard).props().mapName).toBe("lat20200201");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
