import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import App from "@/App.vue";
import router from "@/router";

import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    const pinia = createTestingPinia();
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      pinia,
      router,
      stubs: ["router-link", "router-view"],
    });
    const store = useStore(pinia);
    const authStore = useAuthStore(pinia);
    store.snackbar = false;
    store.snackbarMessage = null;
    store.webConfig = {
      headTitle: "Head Title",
    };
    authStore.isSignedIn = true;
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
    await router.push("/product/map");
    try {
      await router.push("/");
    } catch (err) {
      // Error: Redirected when going from "/" to "/" via a navigation guard.
      // https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
    }
    const trans_attrs = wrapper.find("transition-stub").attributes();
    expect(trans_attrs.name).toBe("fade-app-across");
    expect(trans_attrs.mode).toBe("out-in");
  });

  it("transition within", async () => {
    await router.push("/product/map");
    await router.push("/product/map/map001");
    const trans_attrs = wrapper.find("transition-stub").attributes();
    expect(trans_attrs.name).toBe("fade-app-within");
    expect(trans_attrs.mode).toBe("out-in");
  });
});