import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ProductAddForm from "@/components/product/ProductAddForm.vue";
import { useStore } from "@/stores/main";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductAddForm.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper({ loading = false } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(ProductAddForm, {
      localVue,
      vuetify,
      pinia: createTestingPinia(),
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
      stubs: [
        "dev-tool-loading-state-overriding-menu",
        "product-add-form-step-start",
        "product-add-form-step-relations",
      ],
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
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
  });

  it("instantiate", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper).toBeDefined();
  });

  it("submit", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", "true");
    document.body.append(app);

    const wrapper: any = createWrapper();
    wrapper.setData({ productType: productType });
    const store = useStore();
    await Vue.nextTick();

    const formStepStart = {
      name: "new-map-name",
      contact: "contact-contact",
      dateProduced: "2020-01-11",
      producedBy: "map-map",
      note: "note",
      paths: "/a/b/c\n\n \n/x/y/z \n/a/b/c",
    };
    const formStepRelation = [];

    wrapper.setData({ formStepStart, formStepRelation });
    await Vue.nextTick();
    wrapper.vm.preview();
    await wrapper.vm.submit();
    const calls = wrapper.vm.$apollo.mutate.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].mutation).toBeDefined();

    const expectedCreateProductInput = {
      name: "new-map-name",
      typeId: 1,
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

    expect(store.apolloMutationCalled).toHaveBeenCalled();
    expect(store.setSnackbarMessage).toHaveBeenCalled();
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});