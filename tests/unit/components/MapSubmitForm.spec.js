import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import MapSubmitForm from "@/components/MapSubmitForm.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("MapSubmitForm.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper() {
    const mutate = jest.fn();
    let wrapper = mount(MapSubmitForm, {
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
    expect(wrapper.vm.$apollo.mutate).toBeCalled();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].mutation).toBeDefined();
    expect(calls[0][0].variables).toBeDefined();
    expect(calls[0][0].variables).toEqual({ input: input });
    expect(wrapper.vm.form).toEqual(blankForm); // # clearForm() is called
  });
});
