import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Navigation from "@/components/layout/Navigation";
import router from "@/router";

jest.mock('vue-apollo');
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
      },
    },
  ];

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = shallowMount(Navigation, {
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
    });
    wrapper.setData({
      edges: edges,
    });
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
