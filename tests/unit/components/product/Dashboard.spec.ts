import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import Dashboard from "@/components/product/Dashboard.vue";
import { createRouter } from "@/router";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let wrapper: ReturnType<typeof mount>;

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
    vuetify = new Vuetify();
    router = createRouter();
    wrapper = mount(Dashboard, {
      localVue,
      vuetify,
      router,
      mocks: {
        $apollo: {
          queries: {
            edges: {
              loading: false,
            },
          },
        },
      },
      stubs: {
        DevToolLoadingStateOverridingMenu: true,
      },
    });
    wrapper.setData({
      edges: edges,
    });
  });

  it("match snapshot", async () => {
    await Vue.nextTick();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
