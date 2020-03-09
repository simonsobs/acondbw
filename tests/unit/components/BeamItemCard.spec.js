import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import BeamItemCard from "@/components/BeamItemCard.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("BeamItemCard.vue", () => {
  let localVue;

  function createWrapper({ loading = false, propsData } = {}) {
    let wrapper = mount(BeamItemCard, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            beam: {
              loading: loading
            }
          }
        }
      },
      propsData: {
        beamName: "20200207",
        ...propsData
      }
    });

    return wrapper;
  }

  const beam = {
    beamId: "1150",
    name: "20200207",
    path: "BEAM_DEPOT/Beams/20200207",
    map: {
      name: "lat20200201"
    },
    parentBeam: {
      name: "20200123"
    }
  };

  beforeEach(function() {
    localVue = createLocalVue();
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
      beam: beam
    });
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
      wrapper.setData({
        beam: beam
      });
      await Vue.nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    }
  );
});
