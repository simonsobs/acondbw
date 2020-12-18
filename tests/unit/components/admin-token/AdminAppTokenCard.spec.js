import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import AdminAppTokenCard from "@/components/admin-token/AdminAppTokenCard.vue";
import router from "@/router";

import { requestAuthForAdminApp } from "@/utils/admin-token.js";
jest.mock("@/utils/admin-token.js");

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("AdminAppTokenCard.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper() {
    let wrapper = mount(AdminAppTokenCard, {
      localVue,
      router,
      vuetify,
    });
    return wrapper;
  }

  beforeEach(function () {
    requestAuthForAdminApp.mockClear();
    localVue = createLocalVue();
    vuetify = new Vuetify();
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
    expect(requestAuthForAdminApp.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("requestAuth error", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    requestAuthForAdminApp.mockImplementation(() => {
      throw new Error();
    });
    wrapper.vm.requestAuth();
    expect(requestAuthForAdminApp.mock.calls.length).toBe(1);
    expect(wrapper.vm.loading).toBeFalsy();
    expect(router.history.current.name).toBe("AdminAppTokenError")
  });
});
