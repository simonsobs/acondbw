import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ProductTop from "@/views/product/ProductTop.vue";
import { createRouter } from "@/router";

import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

import { ProductTypeByNameQuery } from "@/generated/graphql";

import { useQuery } from "@urql/vue";
jest.mock("@urql/vue");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductTop.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof shallowMount>;
  let query: ReturnType<typeof useQuery<ProductTypeByNameQuery>>;

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
    // @ts-ignore
    query = {
      data: ref<ProductTypeByNameQuery | undefined>(undefined),
      error: ref(undefined),
      fetching: ref(false),
      isPaused: ref(false),
    };
    (useQuery as jest.Mock).mockReturnValue(query);
    const pinia = createTestingPinia();
    wrapper = shallowMount(ProductTop, {
      localVue,
      vuetify,
      pinia,
      router,
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

  afterEach(() => {
    (useQuery as jest.Mock).mockReset();
  });

  it("match snapshot list", async () => {
    query.data.value = {
      productType: {
        id: "UHJvZHVjdFR5cGU6MQ==",
        typeId: "1",
        name: "map",
        order: 2,
        indefArticle: "a",
        singular: "map",
        plural: "maps",
        icon: "mdi-map",
      },
    };
    await router.push({
      name: "ProductList",
      params: { productTypeName: "map" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot item", async () => {
    query.data.value = {
      productType: {
        id: "UHJvZHVjdFR5cGU6MQ==",
        typeId: "1",
        name: "map",
        order: 2,
        indefArticle: "a",
        singular: "map",
        plural: "maps",
        icon: "mdi-map",
      },
    };
    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map001" },
    });
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
