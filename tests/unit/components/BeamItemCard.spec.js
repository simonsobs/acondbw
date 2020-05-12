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
  let vuetify;

  function createWrapper({ loading = false, propsData } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(BeamItemCard, {
      localVue,
      router,
      vuetify,
      mocks: {
        $apollo: {
          queries: {
            node: {
              loading: loading
            }
          },
          mutate
        }
      },
      propsData: {
        beamName: "20200207",
        ...propsData
      }
    });

    return wrapper;
  }

  const node = {
    id: "QmVhbToxMTUw",
    productId: "1150",
    name: "20200207",
    beamFilePaths: {
      edges: [
        {
          node: {
            id: "QmVhbUZpbGVQYXRoOjQ=",
            path: "BEAM_DEPOT/Beams/20200207",
            note: ""
          }
        }
      ]
    },
    map: {
      name: "lat20200201"
    },
    parentBeam: {
      name: "20200123"
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
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
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
      node: node
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
    "match snapshot - {collapsible: %p, collapsed: %p}",
    async (collapsible, collapsed, visible) => {
      const wrapper = createWrapper({
        propsData: { collapsed: collapsed, collapsible: collapsible }
      });
      wrapper.setData({
        node: node
      });
      await Vue.nextTick();
      expect(wrapper.find(".collapsible").isVisible()).toBe(visible);
    }
  );
});
