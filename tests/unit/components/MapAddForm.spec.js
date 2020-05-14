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
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.append(app);

    const wrapper = createWrapper();

    const form = {
      name: "new-map-name",
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      postedBy: "post-post",
      note: "note",
      paths: "/a/b/c\n\n \n/x/y/z \n/a/b/c",
    };

    const blankForm = { ...wrapper.vm.form };

    wrapper.setData({ form: form });
    await Vue.nextTick();
    await wrapper.vm.addProduct();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].mutation).toBeDefined();

    const expectedCreateMapInput = {
      name: "new-map-name",
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      postedBy: "post-post",
      note: "note",
      paths: ["/a/b/c", "/x/y/z"],
    };

    expect(calls[0][0].variables).toEqual({ input: expectedCreateMapInput });

    expect(wrapper.vm.dialogSuccess).toBe(true);

    wrapper.vm.closeDialogSuccess();

    expect(wrapper.vm.dialogSuccess).toBe(false);
    expect(wrapper.vm.form).toEqual(blankForm); // # resetForm() is called
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});
