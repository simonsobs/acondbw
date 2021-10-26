import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import ProductTop from "@/views/product/ProductTop.vue";

import store from "@/store";
jest.mock("@/store");

import router from "@/router";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductTop.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper(loading = false) {
    return shallowMount(ProductTop, {
      localVue,
      vuetify,
      router,
      mocks: {
        $store: {
          state: {
            webConfig: {
              productCreationDialog: true,
              productUpdateDialog: true,
              productDeletionDialog: true,
            },
          },
        },
        $apollo: {
          queries: {
            node: {
              loading: loading,
            },
          },
        },
      },
      propsData: {},
      stubs: ["router-link", "router-view"],
    });
  }

  beforeEach(function () {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    store.state = { auth: { isSignedIn: true } };
  });

  it("match snapshot list", async () => {
    const wrapper = createWrapper();
    await router.push({
      name: "ProductList",
      params: { productTypeName: "map" },
    });
    await Vue.nextTick();
    wrapper.setData({
      node: {
        id: "UHJvZHVjdFR5cGU6MQ==",
        typeId: "1",
        name: "map",
        order: 2,
        indefArticle: "a",
        singular: "map",
        plural: "maps",
        icon: "mdi-map",
      },
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot item", async () => {
    const wrapper = createWrapper();
    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map001" },
    });
    await Vue.nextTick();
    await Vue.nextTick();
    wrapper.setData({
      webConfig: {
        productCreationDialog: true,
        productUpdateDialog: true,
        productDeletionDialog: true,
      },
    });
    await Vue.nextTick();
    wrapper.setData({
      node: {
        id: "UHJvZHVjdFR5cGU6MQ==",
        typeId: "1",
        name: "map",
        order: 2,
        indefArticle: "a",
        singular: "map",
        plural: "maps",
        icon: "mdi-map",
      },
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("transition update", async () => {
    const wrapper = createWrapper();
    await router.push({
      name: "ProductList",
      params: { productTypeName: "map" },
    });
    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map001" },
    });

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-maps-update');
    // expect(trans_attrs.mode).toBe('out-in');
  });

  it("transition leave", async () => {
    const wrapper = createWrapper();
    await router.push({ name: "ProductList" });
    await router.push("/about");

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-maps-leave');
    // expect(trans_attrs.mode).toBe('out-in');
  });
});
