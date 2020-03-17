import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import MapAddForm from "@/components/MapAddForm.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("MapAddForm.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper() {
    const mutate = jest.fn();
    let wrapper = mount(MapAddForm, {
      localVue,
      vuetify,
      mocks: {
        $apollo: {
          mutate
        }
      }
    });

    return wrapper;
  }

  beforeEach(function() {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it("instantiate", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper).toBeDefined();
  });

  it("add", async () => {
    const wrapper = createWrapper();
    const input = {
      name: "new-map-name",
      datePosted: "2020-01-11",
      mapper: "map-map",
      note: "note"
    };

    const blankForm = { ...wrapper.vm.form };

    wrapper.setData({ form: input });
    await Vue.nextTick();
    await wrapper.vm.addMap();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].mutation).toBeDefined();
    expect(calls[0][0].variables).toEqual({ input: input });
    expect(wrapper.vm.form).toEqual(blankForm); // # resetForm() is called
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});
