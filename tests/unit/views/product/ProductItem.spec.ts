import { Mock } from "vitest";
import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ProductItem from "@/views/product/ProductItem.vue";
import { createRouter } from "@/plugins/router";

import { useAuthStore } from "@/stores/auth";

import { ProductByTypeIdAndNameQuery } from "@/generated/graphql";

import { CombinedError } from "@urql/core";

import { useQuery } from "@urql/vue";
vi.mock("@urql/vue");


Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductItem.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let router: ReturnType<typeof createRouter>;
  let pinia: ReturnType<typeof createTestingPinia>;
  let query: ReturnType<typeof useQuery<ProductByTypeIdAndNameQuery>>;

  function createWrapper() {
    return shallowMount(ProductItem, {
      localVue,
      pinia,
      router,
      propsData: {
        productTypeId: 1,
      },
      stubs: {
        ProductItemCard: true,
        "dev-tool-loading-state-menu": true,
      },
    });
  }

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    router = createRouter();
    // @ts-ignore
    query = {
      data: ref<ProductByTypeIdAndNameQuery | undefined>(undefined),
      error: ref(undefined),
      fetching: ref(false),
      isPaused: ref(false),
    };
    (useQuery as Mock).mockReturnValue(query);
    pinia = createTestingPinia();
    const authStore = useAuthStore(pinia);
    authStore.isSignedIn = true;
  });

  afterEach(() => {
    (useQuery as Mock).mockReset();
  });

  it("match snapshot", async () => {
    query.data.value = {
      product: {
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
    };
    const wrapper = createWrapper();
    await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  // it("loading state - loading", async () => {
  //   const loading = true;
  //   query.fetching.value = loading;
  //   const wrapper = createWrapper();
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  //   expect(wrapper.find("v-progress-circular-stub").exists()).toBe(true);
  // });

  it("loading state - error", async () => {
    const wrapper = createWrapper();
    const error = new CombinedError({
      graphQLErrors: ["Error: cannot load data"],
    });
    query.error.value = error;
    await nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("loading state - none", async () => {
    const wrapper = createWrapper();
    await nextTick();
    // expect(wrapper.text()).toContain("Nothing to show here");
  });

  it("keep name when moving away", async () => {
    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map001" },
    });
    const wrapper = createWrapper();
    await nextTick();

    // @ts-ignore
    // expect(wrapper.vm.name).toBe("map001");

    await router.push("/about");
    await nextTick();

    // @ts-ignore
    // expect(wrapper.vm.name).toBe("map001"); // still "map001"

    await router.push({
      name: "ProductItem",
      params: { productTypeName: "map", name: "map002" },
    });
    await nextTick();

    // @ts-ignore
    // expect(wrapper.vm.name).toBe("map001"); // still "map001". The name is set only once.
    // New instance should be created for a different name.
  });
});
