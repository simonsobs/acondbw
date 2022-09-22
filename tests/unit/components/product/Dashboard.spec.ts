import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import Dashboard from "@/components/product/Dashboard.vue";
import { createRouter } from "@/router";

import { useStore } from "@/stores/main";

import { AllProductTypesQuery, ProductTypeEdge } from "@/generated/graphql";

import { useQuery } from "@urql/vue";
jest.mock("@urql/vue");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof mount>;
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
          totalCount: 1,
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
          totalCount: 64,
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
          totalCount: 7,
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
    (useQuery as jest.Mock).mockReturnValue(query);
    const pinia = createTestingPinia();
    store = useStore(pinia);
    wrapper = mount(Dashboard, {
      localVue,
      vuetify,
      pinia,
      router,
      stubs: ["dev-tool-loading-state-menu"],
    });
    query.data.value = { allProductTypes: { edges: edges } };
  });

  afterEach(() => {
    (useQuery as jest.Mock).mockReset();
  });

  it("match snapshot", async () => {
    await nextTick();
    await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
