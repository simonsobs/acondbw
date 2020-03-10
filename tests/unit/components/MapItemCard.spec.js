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
  let vuetify;

  function createWrapper({ loading = false, propsData } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(MapItemCard, {
      localVue,
      router,
      vuetify,
      mocks: {
        $apollo: {
          queries: {
            map: {
              loading: loading
            }
          },
          mutate
        }
      },
      propsData: {
        mapName: "lat20200201",
        ...propsData
      }
    });

    return wrapper;
  }

  const map = {
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
  };

  beforeEach(function() {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper({ loading });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("loading");
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: true
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Nothing to show here");
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      map: map
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each([
    [true, true, false],
    [true, false, true],
    [false, true, true],
    [false, false, true]
  ])(
    "collapsed - {collapsible: %p, collapsed: %p, visible: %p}",
    async (collapsible, collapsed, visible) => {
      const wrapper = createWrapper({
        propsData: { collapsed: collapsed, collapsible: collapsible }
      });
      wrapper.setData({
        map: map
      });
      await Vue.nextTick();
      expect(wrapper.find(".collapsible").isVisible()).toBe(visible);
    }
  );

  it("delete", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      map: map
    });
    await wrapper.vm.deleteMap();
    expect(wrapper.vm.$apollo.mutate).toBeCalled();
    expect(wrapper.emitted("mutated")).toBeTruthy();
  });
});
