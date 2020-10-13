import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import ProductAddForm from "@/components/product/ProductAddForm.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductAddForm.vue", () => {
  let localVue;
  let vuetify;
  let actions;
  let store;

  function createWrapper({ loading = false } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(ProductAddForm, {
      localVue,
      vuetify,
      store,
      propsData: {
        productTypeId: 1,
      },
      mocks: {
        $apollo: {
          queries: {
            productType: {
              loading: loading,
            },
          },
          mutate,
        },
      },
    });

    return wrapper;
  }

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();

    actions = {
      apolloMutationCalled: jest.fn(),
      snackbarMessage: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
      state: {
        snackbar: false,
        snackbarMessage: null,
      },
    });
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
    wrapper.vm.$refs.form = {};
    wrapper.vm.$refs.form.resetValidation = jest.fn();

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

    const expectedCreateProductInput = {
      name: "new-map-name",
      typeId: 1,
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      postedBy: "post-post",
      note: "note",
      paths: ["/a/b/c", "/x/y/z"],
      relations: [],
    };

    expect(calls[0][0].variables).toEqual({
      input: expectedCreateProductInput,
    });

    expect(actions.apolloMutationCalled).toHaveBeenCalled();
    expect(actions.snackbarMessage).toHaveBeenCalled();
    expect(wrapper.vm.form).toEqual(blankForm); // # resetForm() is called
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});
