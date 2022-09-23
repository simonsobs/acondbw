import { Mock } from "vitest";
import Vue, { ref, nextTick } from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ProductDeleteForm from "@/components/product/ProductDeleteForm.vue";
import { createRouter } from "@/router";
import { useStore } from "@/stores/main";

import { useQuery, useMutation } from "@urql/vue";
vi.mock("@urql/vue");

import {
  ProductQuery,
  ProductQueryVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
} from "@/generated/graphql";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductDeleteForm.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let router: ReturnType<typeof createRouter>;
  let query: ReturnType<typeof useQuery<ProductQuery>>;
  let mutation: ReturnType<
    typeof useMutation<DeleteProductMutation, DeleteProductMutationVariables>
  >;

  function createWrapper({ propsData = {} } = {}) {
    const mutate = vi.fn();
    let wrapper = mount(ProductDeleteForm, {
      localVue,
      router,
      vuetify,
      pinia: createTestingPinia(),
      propsData: {
        productId: 1013,
        ...propsData,
      },
      stubs: ["dev-tool-loading-state-menu"],
    });

    return wrapper;
  }

  const node = {
    id: "UHJvZHVjdDoxMDEz",
    productId: "1013",
    name: "lat20200201",
    typeId: 1,
    type_: {
      singular: "map",
    },
  };

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
    vuetify = new Vuetify();
    router = createRouter();
    // @ts-ignore
    query = {
      data: ref<ProductQuery | undefined>(undefined),
      error: ref(undefined),
      fetching: ref(false),
    };
    (useQuery as Mock).mockReturnValue(query);
    // @ts-ignore
    mutation = {
      executeMutation: vi.fn(),
    };
    (useMutation as Mock).mockReturnValue(mutation);
    (mutation.executeMutation as Mock).mockReturnValue({ error: null });
  });

  afterEach(() => {
    (useQuery as Mock).mockReset();
    (useMutation as Mock).mockReset();
  });

  it("loading", async () => {
    const loading = true;
    query.fetching.value = loading;
    const wrapper = createWrapper();
    await nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: "Error message!",
    });
    await nextTick();
    expect(wrapper.text()).toContain("Error message");
  });

  it("delete", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", "true");
    document.body.append(app);

    // @ts-ignore
    query.data.value = { product: node };
    const wrapper: any = createWrapper();
    const store = useStore();
    await wrapper.vm.remove();
    expect(mutation.executeMutation).toBeCalled();
    expect(store.apolloMutationCalled).toHaveBeenCalled();
    expect(store.setSnackbarMessage).toHaveBeenCalled();
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});
