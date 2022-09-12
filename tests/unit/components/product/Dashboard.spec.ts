import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import Dashboard from "@/components/product/Dashboard.vue";
import { createRouter } from "@/router";

import { useStore } from "@/stores/main";

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

  const edges = [
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
    const query = {
      data: ref(null as any),
      error: ref(null),
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
      stubs: {
        DevToolLoadingStateOverridingMenu: true,
      },
    });
    query.data.value = { allProductTypes: { edges: edges } };
  });

  it("match snapshot", async () => {
    await nextTick();
    await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
