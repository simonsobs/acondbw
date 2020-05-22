import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import ProductList from "@/views/ProductList.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductList.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(ProductList, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            productType: {
              loading: loading,
            },
            edges: {
              loading: loading,
            },
          },
        },
      },
      propsData: {
        productTypeId: 1,
        nameOfRouteToProductItem: "MapItem",
        productAddForm: "MapAddForm",
        disableAdd: false,
      },
      stubs: {
        ProductItemCard: true,
        MapAddForm: true,
      },
    });
  }

  const productType = {
    id: "UHJvZHVjdFR5cGU6MQ==",
    typeId: "1",
    name: "map",
    singular: "map",
    plural: "maps",
    indefArticle: "a",
  };

  const edges = [
    {
      node: {
        id: "TWFwOjEwMTM=",
        productId: "1013",
        name: "lat20200201",
      },
    },
    {
      node: {
        id: "TWFwOjEwMTI=",
        productId: "1012",
        name: "lat20200120",
      },
    },
    {
      node: {
        id: "TWFwOjEwMDE=",
        productId: "1001",
        name: "lat20190213",
      },
    },
  ];

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      productType: productType,
      edges: edges,
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
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
    wrapper.setData({
      productType: productType,
      edges: [],
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Empty. No maps are found.");
  });
});
