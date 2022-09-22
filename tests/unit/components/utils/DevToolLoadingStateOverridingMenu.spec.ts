import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";
import State from "@/utils/LoadingState";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("DevToolLoadingStateOverridingMenu.vue", () => {
  let localVue;
  let vuetify;

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
  });

  function createWrapper(loading = false) {
    let wrapper = mount(DevToolLoadingStateOverridingMenu, {
      localVue,
      vuetify,
      pinia: createTestingPinia(),
      mocks: {
        $store: {
          state: {
            webConfig: {
              devtoolLoadingstate: true
            },
          },
        },
      },
    });

    return wrapper;
  }

  it("emit a state", async () => {
    const wrapper: any = createWrapper();
    await Vue.nextTick();
    wrapper.setData({
      state: State.LOADING,
    });
    await Vue.nextTick();
    expect(wrapper.emitted("state").length).toBe(1);
    expect(wrapper.emitted("state")[0]).toEqual([State.LOADING]);
  });

  it("off - emit null", async () => {
    const wrapper: any = createWrapper();
    await Vue.nextTick();
    wrapper.setData({
      state: State.LOADING,
    });
    await Vue.nextTick();
    wrapper.setData({
      state: null,
    });
    await Vue.nextTick();
    expect(wrapper.emitted("state").length).toBe(2);
    expect(wrapper.emitted("state")[1]).toEqual([null]);
  });
});
