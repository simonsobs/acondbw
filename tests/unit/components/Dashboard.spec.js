import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Dashboard from "@/components/Dashboard";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

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
    console.log(wrapper.html());
    expect(wrapper.html()).toMatchSnapshot();
  });
});
