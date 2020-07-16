import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let vuetify;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    process.env.VUE_APP_TOOLBAR_TITLE = "Product DB Title";
    process.env.VUE_APP_GRAPHQL_HTTP = "http://graphql.api:5000/graphql";
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
    actions = {};
    store = new Vuex.Store({
      actions,
      state: {
        snackbar: false,
        snackbarMessage: null,
      },
    });
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      router,
      store,
      stubs: ["router-link", "router-view"],
    });
  });

  afterEach(() => {
    process.env = ENV_ORG;
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
