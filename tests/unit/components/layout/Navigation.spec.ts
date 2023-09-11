import { Mock } from "vitest";
import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import Navigation from "@/components/layout/Navigation.vue";
import { createRouter } from "@/plugins/router";
import { useStore } from "@/plugins/pinia/stores/main";

import { AllProductTypesQuery, ProductTypeEdge } from "@/generated/graphql";

import { useQuery } from "@urql/vue";
vi.mock("@urql/vue");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof shallowMount>;
  let store: ReturnType<typeof useStore>;
  let query: ReturnType<typeof useQuery<AllProductTypesQuery>>;

  const edges: ProductTypeEdge[] = [
    {
      node: {
        id: "UHJvZHVjdFR5cGU6Mw==",
        typeId: "3",
        name: "simulation",
        order: 1,
        indefArticle: "a",
        singular: "simulation",
        plural: "simulations",
        icon: "mdi-creation",
        // @ts-ignore
        products: {
          totalCount: 0,
        },
      },
    },
    {
      node: {
        id: "UHJvZHVjdFR5cGU6MQ==",
        typeId: "1",
        name: "map",
        order: 2,
        indefArticle: "a",
        singular: "map",
        plural: "maps",
        icon: "mdi-map",
        // @ts-ignore
        products: {
          totalCount: 58,
        },
      },
    },
    {
      node: {
        id: "UHJvZHVjdFR5cGU6Mg==",
        typeId: "2",
        name: "beam",
        order: 3,
        indefArticle: "a",
        singular: "beam",
        plural: "beams",
        icon: "mdi-spotlight-beam",
        // @ts-ignore
        products: {
          totalCount: 5,
        },
      },
    },
  ];

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
    // @ts-ignore
    query = {
      data: ref<AllProductTypesQuery | undefined>(undefined),
      error: ref(undefined),
      fetching: ref(false),
    };
    (useQuery as Mock).mockReturnValue(query);
    const pinia = createTestingPinia();
    store = useStore(pinia);
    store.packageVersion = "0.1.1";
    wrapper = shallowMount(Navigation, {
      localVue,
      vuetify,
      pinia,
      router,
      stubs: ["dev-tool-loading-state-menu"], 
    });
    query.data.value = { allProductTypes: { edges: edges } };
  });

  afterEach(() => {
    (useQuery as Mock).mockReset();
  });

  it("match snapshot", async () => {
    await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
