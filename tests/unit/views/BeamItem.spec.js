import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import BeamItem from "@/views/BeamItem.vue";
import BeamItemCard from "@/components/BeamItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("BeamItem.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(BeamItem, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            beam: {
              loading: loading
            }
          }
        }
      },
      stubs: {
        BeamItemCard: true
      }
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      beam: {
        beamId: "1150",
        name: "20200207",
      }
    });
    await Vue.nextTick();
    expect(wrapper.find(BeamItemCard).props().beamName).toBe("20200207");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
    await Vue.nextTick();
    expect(wrapper.text()).toContain('loading')
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: true
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain('Error: cannot load data')
  });

  it("none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.text()).toContain('Nothing to show here')
  });
  
});
