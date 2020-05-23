import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import ProductItem from "@/views/ProductItem.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductItem.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(ProductItem, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            node: {
              loading: loading,
            },
          },
        },
      },
      propsData: {
        productTypeId: 1,
      },
      stubs: {
        ProductItemCard: true,
      },
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      node: {
        id: "UHJvZHVjdDoxMDEz",
        productId: "1013",
        name: "lat20200201",
        typeId: 1,
        type_: {
          id: "UHJvZHVjdFR5cGU6MQ==",
          typeId: "1",
          name: "map",
        },
      },
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("loading state - loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
    await Vue.nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("loading state - error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: "Error: cannot load data",
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("loading state - none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    // expect(wrapper.text()).toContain("Nothing to show here");
  });

  it("keep name when moving away", async () => {
    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map001" },
    });
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("map001");

    await router.push("/about");
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("map001"); // still "map001"

    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map002" },
    });
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("map001"); // still "map001". The name is set only once.
    // New instance should be created for a different name.
  });
});
