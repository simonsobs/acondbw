import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import SimulationList from "@/views/SimulationList.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SimulationList.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(SimulationList, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            allSimulations: {
              loading: loading
            }
          }
        }
      },
      stubs: ["SimulationItemCard"]
    });
  }

  const allSimulations = {
    edges: [
      {
        node: {
          id: "U2ltdWxhdGlvbjoxMDAx",
          simulationId: "1001",
          name: "xyz-s1234-20200101",
          datePosted: "2019-03-15",
          mapper: "abc-def",
          note: "- note 1\n- note 2"
        }
      }
    ]
  };

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      allSimulations: allSimulations
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
    await Vue.nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: true
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("none", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      allSimulations: { edges: [] }
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Empty. No simulations are found.");
  });
});
