import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import SimulationItem from "@/views/SimulationItem.vue";
import SimulationItemCard from "@/components/SimulationItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("SimulationItem.vue", () => {
  let localVue;

  function createWrapper(loading = false) {
    return mount(SimulationItem, {
      localVue,
      router,
      mocks: {
        $apollo: {
          queries: {
            simulation: {
              loading: loading
            }
          }
        }
      },
      stubs: {
        SimulationItemCard: true
      }
    });
  }

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      simulation: {
        id: "U2ltdWxhdGlvbjoxMDAx",
        simulationId: "1001",
        name: "xyz-s1234-20200101"
      }
    });
    await Vue.nextTick();
    expect(wrapper.find(SimulationItemCard).props().simulationId).toBe("1001");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("loading state - loading", async () => {
    const loading = true;
    const wrapper = createWrapper(loading);
    await Vue.nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("loading state - error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: true
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("loading state - none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Nothing to show here");
  });

  it("keep name when moving away", async () => {
    const wrapper = createWrapper();
    await router.push({
      name: "SimulationItem",
      params: { name: "simulation001" }
    });
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("simulation001");

    await router.push("/about");
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("simulation001"); // still "simulation001"

    await router.push({
      name: "SimulationItem",
      params: { name: "simulation002" }
    });
    await Vue.nextTick();
    expect(wrapper.vm.name).toBe("simulation002");
  });
});
