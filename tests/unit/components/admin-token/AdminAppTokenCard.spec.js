import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import AdminAppTokenCard from "@/components/admin-token/AdminAppTokenCard.vue";
import router from "@/router";

import store from "@/store";
jest.mock("@/store");

import { requestAuth } from "@/utils/auth.js";
jest.mock("@/utils/auth.js");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("AdminAppTokenCard.vue", () => {
  let localVue;
  let vuetify;
  let actions;
  let store_;

  function createWrapper() {
    let wrapper = mount(AdminAppTokenCard, {
      localVue,
      router,
      vuetify,
      store: store_,
    });
    return wrapper;
  }

  beforeEach(function () {
    requestAuth.mockClear();
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
    actions = {
      clearAuthError: jest.fn(),
    };
    store_ = new Vuex.Store({
      actions,
    });

    store.state = { auth : { token : "XXXXXXXXXX" } }; // mock store in "@/src/router/index.js"
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("match snapshot loading", async () => {
    const wrapper = createWrapper();
    wrapper.setData({ loading: true });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("requestAuth success", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    wrapper.vm.requestAuth();
    expect(actions.clearAuthError.mock.calls.length).toBe(1);
    expect(requestAuth.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("requestAuth error", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    requestAuth.mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.requestAuth();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(actions.clearAuthError.mock.calls.length).toBe(1);
    expect(requestAuth.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(router.history.current.name).toBe("AdminAppTokenError");
  });
});
