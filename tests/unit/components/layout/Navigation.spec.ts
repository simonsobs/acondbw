import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import Navigation from "@/components/layout/Navigation.vue";
import router from "@/router";
import { useStore } from "@/stores/main";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;
  let store;

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
    const pinia = createTestingPinia();
    wrapper = shallowMount(Navigation, {
      localVue,
      vuetify,
      pinia,
      router,
      mocks: {
        $apollo: {
          loading: false,
          queries: {
            edges: {
              loading: false,
            },
          },
        },
      },
    });
    wrapper.setData({
      edges: edges,
    });
    store = useStore(pinia);
    store.packageVersion = "0.1.1";
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
