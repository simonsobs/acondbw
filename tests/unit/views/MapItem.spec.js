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

  function createWrapper(loading = false) {
    return mount(MapItem, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            map: {
              loading: loading
            }
          }
        }
      },
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

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
    await Vue.nextTick();
    expect(wrapper.text()).toContain('loading')
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: true
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain('Error: cannot load data')
  });

  it("none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.text()).toContain('Nothing to show here')
  });
  
});
