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
          mutate,
        },
      },
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

    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement ("div");
    app.setAttribute ("data-app", true);
    document.body.append (app);

    const wrapper = createWrapper();
    const createMapInput = {
      name: "new-map-name",
      datePosted: "2020-01-11",
      mapper: "map-map",
      note: "note",
    };

    const form = {
      paths: "/a/b/c\n\n \n/x/y/z \n  ",
      ...createMapInput,
    };

    const createMap = {
      map: {
        id: "TWFwOjEwMTk=",
        mapId: "1019",
        ...createMapInput,
      },
    };

    const blankForm = { ...wrapper.vm.form };

    wrapper.setData({ form: form });
    await Vue.nextTick();
    wrapper.vm.$apollo.mutate.mockReturnValue({ data: { createMap } });
    await wrapper.vm.addMap();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(3);
    expect(calls[0][0].mutation).toBeDefined();
    expect(calls[0][0].variables).toEqual({ input: createMapInput });
    expect(calls[1][0].mutation).toBeDefined();
    expect(calls[1][0].variables).toEqual({
      input: { mapId: "1019", path: "/a/b/c" },
    });
    expect(calls[2][0].mutation).toBeDefined();
    expect(calls[2][0].variables).toEqual({
      input: { mapId: "1019", path: "/x/y/z" },
    });
    expect(wrapper.vm.dialogSuccess).toBe(true);

    wrapper.vm.closeDialogSuccess();

    expect(wrapper.vm.dialogSuccess).toBe(false);
    expect(wrapper.vm.form).toEqual(blankForm); // # resetForm() is called
    expect(wrapper.emitted("finished")).toBeTruthy();
  });

});
