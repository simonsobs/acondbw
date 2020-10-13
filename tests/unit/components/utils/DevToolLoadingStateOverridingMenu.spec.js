import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";
import State from "@/utils/LoadingState.js";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("DevToolLoadingStateOverridingMenu.vue", () => {
  let localVue;
  let vuetify;

  beforeEach(function () {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  function createWrapper(loading = false) {
    let wrapper = mount(DevToolLoadingStateOverridingMenu, {
      localVue,
      vuetify,
      mocks: {
        $apollo: {
          queries: {
            enabled: {
              loading: loading,
            },
          },
        },
      },
    });

    return wrapper;
  }

  it("emit a state", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      enabled: true,
    });
    await Vue.nextTick();
    wrapper.setData({
      state: State.LOADING,
    });
    await Vue.nextTick();
    expect(wrapper.emitted("state").length).toBe(1);
    expect(wrapper.emitted("state")[0]).toEqual([State.LOADING]);
  });

  it("off - emit null", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      enabled: true,
    });
    await Vue.nextTick();
    wrapper.setData({
      state: State.LOADING,
    });
    await Vue.nextTick();
    wrapper.setData({
      state: "off",
    });
    await Vue.nextTick();
    expect(wrapper.emitted("state").length).toBe(2);
    expect(wrapper.emitted("state")[1]).toEqual([null]);
  });
});
