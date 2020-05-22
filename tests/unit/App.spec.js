import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";
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
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      router,
      stubs: ["router-link", "router-view"],
    });
    wrapper.setData({
      edges: edges,
    });
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("transition initial", async () => {
    const trans_attrs = wrapper.find("transition-stub").attributes();
    expect(trans_attrs.name).toBe("fade-app-across");
    expect(trans_attrs.mode).toBe("out-in");
  });

  it("transition across", async () => {
    await router.push("/maps");
    await router.push("/");
    const trans_attrs = wrapper.find("transition-stub").attributes();
    expect(trans_attrs.name).toBe("fade-app-across");
    expect(trans_attrs.mode).toBe("out-in");
  });

  it("transition within", async () => {
    await router.push("/maps");
    await router.push("/maps/item/map001");
    const trans_attrs = wrapper.find("transition-stub").attributes();
    expect(trans_attrs.name).toBe("fade-app-within");
    expect(trans_attrs.mode).toBe("out-in");
  });
});
