import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import MapItemCard from "@/components/MapItemCard.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("MapItemCard.vue", () => {
  let localVue;

  function createWrapper({ propsData } = {}) {
    let wrapper = mount(MapItemCard, {
      localVue,
      router,
      propsData: {
        mapName: "map123456",
        ...propsData
      }
    });
    wrapper.setData({
      map: {
        mapId: "1013",
        name: "lat20200201",
        datePosted: "2020-02-01",
        mapper: "pwg-pmn",
        mapFilePaths: {
          edges: [
            {
              node: {
                path: "nersc:/go/to/my/maps_v3",
                note: "lat only"
              }
            }
          ]
        },
        note:
          "- This is a dummy test with a lat map                         \n- A beam depends on this map",
        beams: {
          edges: [
            {
              node: {
                beamId: "1150",
                name: "20200207"
              }
            }
          ]
        }
      }
    });
    return wrapper;
  }


  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ])(
    "match snapshot - {collapsible: %p, collapsed: %p}",
    async (collapsible, collapsed) => {
      const wrapper = createWrapper({
        propsData: { collapsed: collapsed, collapsible: collapsible }
      });
      await Vue.nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    }
  );
});
