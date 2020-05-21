import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import ProductItemCard from "@/components/ProductItemCard.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductItemCard.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper({ loading = false, propsData } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(ProductItemCard, {
      localVue,
      router,
      vuetify,
      mocks: {
        $apollo: {
          queries: {
            node: {
              loading: loading,
            },
          },
          mutate,
        },
      },
      propsData: {
        productTypeNameSingular: "map",
        productTypeNamePlural: "maps",
        nameOfRouteToProductItem: "MapItem",
        productId: 1013,
        ...propsData,
      },
    });

    return wrapper;
  }

  const node = {
    id: "TWFwOjEwMTM=",
    productId: 1013,
    typeId: 1,
    name: "lat20200201",
    datePosted: "2020-02-01",
    productper: "pwg-pmn",
    paths: {
      edges: [
        {
          node: {
            id: "TWFwRmlsZVBhdGg6NA==",
            path: "nersc:/go/to/my/maps_v3",
            note: "lat only",
          },
        },
      ],
    },
    note:
      "- This is a dummy test with a lat map\n- A beam depends on this map\n- **marked**",
    beams: {
      edges: [
        {
          node: {
            id: "QmVhbToxMTUw",
            productId: "1150",
            name: "20200207",
          },
        },
      ],
    },
  };

  beforeEach(function() {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper({ loading });
    await Vue.nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: "Error: cannot load data",
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
      node: node,
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each([
    [true, true, false],
    [true, false, true],
    [false, true, true],
    [false, false, true],
  ])(
    "collapsed - {collapsible: %p, collapsed: %p, visible: %p}",
    async (collapsible, collapsed, visible) => {
      const wrapper = createWrapper({
        propsData: { collapsed: collapsed, collapsible: collapsible },
      });
      wrapper.setData({
        node: node,
      });
      await Vue.nextTick();
      expect(wrapper.find(".collapsible").isVisible()).toBe(visible);
    }
  );
});
