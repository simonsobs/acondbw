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
        nameOfRouteToProductItem: "MapItem",
        productId: 1013,
        ...propsData,
      },
    });

    return wrapper;
  }

  const node = {
    id: "UHJvZHVjdDoxMDEz",
    productId: "1013",
    typeId: 1,
    type_: {
      id: "UHJvZHVjdFR5cGU6MQ==",
      typeId: "1",
      name: "map",
    },
    name: "lat20200201",
    contact: "pwg-pmn",
    dateProduced: "2020-02-01",
    producedBy: "pwg-pmn",
    datePosted: "2020-02-01",
    postedBy: "pwg-pmn",
    dateUpdated: "2020-02-01",
    updatedBy: "pwg-pmn",
    paths: {
      edges: [
        {
          node: {
            id: "UHJvZHVjdEZpbGVQYXRoOjQ=",
            pathId: "4",
            path: "nersc:/go/to/my/maps_v3",
            note: "lat only",
          },
        },
      ],
    },
    relations: {
      edges: [
        {
          node: {
            id: "UHJvZHVjdFJlbGF0aW9uOjQ=",
            relationId: "4",
            typeId: 2,
            type_: {
              id: "UHJvZHVjdFJlbGF0aW9uVHlwZToy",
              typeId: "2",
              name: "child",
            },
            otherProductId: 1150,
            other: {
              id: "UHJvZHVjdDoxMTUw",
              productId: "1150",
              typeId: 2,
              type_: {
                id: "UHJvZHVjdFR5cGU6Mg==",
                typeId: "2",
                name: "beam",
              },
              name: "20200207",
            },
            reverseRelationId: 3,
            reverse: {
              id: "UHJvZHVjdFJlbGF0aW9uOjM=",
              relationId: "3",
              typeId: 1,
              type_: {
                id: "UHJvZHVjdFJlbGF0aW9uVHlwZTox",
                typeId: "1",
                name: "parent",
              },
            },
          },
        },
      ],
    },
    note: "- This is a dummy test with a lat map\n- A beam depends on this map",
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
