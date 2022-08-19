import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ProductTop from "@/views/product/ProductTop.vue";
import { createRouter } from "@/router";

import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductTop.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof shallowMount>;

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
    const pinia = createTestingPinia();
    wrapper = shallowMount(ProductTop, {
      localVue,
      vuetify,
      pinia,
      router,
      mocks: {
        $apollo: {
          loading: false,
          queries: {
            node: {
              loading: false,
            },
          },
        },
      },
      propsData: {},
      stubs: ["router-link", "router-view"],
    });
    const store = useStore(pinia);
    const authStore = useAuthStore(pinia);
    store.webConfig = {
      productCreationDialog: true,
      productUpdateDialog: true,
      productDeletionDialog: true,
    };
    authStore.isSignedIn = true;
  });

  it("match snapshot list", async () => {
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
    await router.push({
      name: "ProductList",
      params: { productTypeName: "map" },
    });
    await router.push("/about");

    // Not clear how to test
    // Neither beforeRouteUpdate() or beforeRouteLeave() is called
    // in the test

    // const trans_attrs = wrapper.find('transition-stub').attributes();
    // expect(trans_attrs.name).toBe('fade-maps-leave');
    // expect(trans_attrs.mode).toBe('out-in');
  });
});
