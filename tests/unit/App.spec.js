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
  let localVue;
  let vuetify;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
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
    wrapper.setData({
      title: "Head Title",
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
