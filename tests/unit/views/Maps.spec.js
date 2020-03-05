import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import Maps from "@/views/Maps.vue";
import MapItemCard from "@/components/MapItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Maps.vue", () => {
  let localVue;

  function createWrapper() {
    return mount(Maps, {
      localVue,
      router,
      mocks: {},
      stubs: {
        MapItemCard: true,
        MapSubmitFormDialog: true
      }
    });
  }

  const allMaps = {
    edges: [
      {
        node: {
          id: "TWFwOjEwMTM=",
          name: "lat20200201"
        }
      },
      {
        node: {
          id: "TWFwOjEwMTI=",
          name: "lat20200120"
        }
      },
      {
        node: {
          id: "TWFwOjEwMDE=",
          name: "lat20190213"
        }
      }
    ]
  };

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();

    wrapper.setData({
      allMaps: allMaps,
      isCardCollapsed: {
        "TWFwOjEwMDE=": true,
        "TWFwOjEwMTI=": true,
        "TWFwOjEwMTM=": true
      }
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
