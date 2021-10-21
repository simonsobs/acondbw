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

  const productType = {
    id: "UHJvZHVjdFR5cGU6MQ==",
    typeId: "1",
    name: "map",
    order: 2,
    indefArticle: "a",
    singular: "map",
    plural: "maps",
    icon: "mdi-map",
    fields: {
      edges: [
        {
          node: {
            typeId: "1",
            fieldId: "1",
            field: {
              fieldId: "1",
              name: "contact",
              type_: "UNICODE_TEXT",
            },
          },
        },
        {
          node: {
            typeId: "1",
            fieldId: "2",
            field: {
              fieldId: "2",
              name: "produced_by",
              type_: "UNICODE_TEXT",
            },
          },
        },
        {
          node: {
            typeId: "1",
            fieldId: "3",
            field: {
              fieldId: "3",
              name: "date_produced",
              type_: "DATE",
            },
          },
        },
      ],
    },
  };

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

  it("submit", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.append(app);

    const wrapper = createWrapper();
    wrapper.setData({ productType: productType });
    await Vue.nextTick();
    wrapper.vm.$refs.form = {};
    wrapper.vm.$refs.form.resetValidation = jest.fn();

    const form = {
      name: "new-map-name",
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      note: "note",
      paths: "/a/b/c\n\n \n/x/y/z \n/a/b/c",
    };

    const blankForm = { ...wrapper.vm.form };

    wrapper.setData({ form: form });
    await Vue.nextTick();
    wrapper.vm.preview();
    await wrapper.vm.submit();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].mutation).toBeDefined();

    const expectedCreateProductInput = {
      name: "new-map-name",
      typeId: 1,
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      note: "note",
      paths: ["/a/b/c", "/x/y/z"],
      relations: [],
      attributes: {
        date: [
          {
            fieldId: "3",
            value: "2020-01-11",
          },
        ],
        unicodeText: [
          {
            fieldId: "1",
            value: "contact-contact",
          },
          {
            fieldId: "2",
            value: "map-map",
          },
        ],
      },
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
