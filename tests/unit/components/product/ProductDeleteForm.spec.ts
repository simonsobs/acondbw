import Vue from "vue";
import VueRouter from "vue-router";
import { PiniaVuePlugin } from "pinia";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing"

import ProductDeleteForm from "@/components/product/ProductDeleteForm.vue";
import router from "@/router";
import { useStore } from "@/stores/main";

jest.mock("vue-apollo");
// To prevent the error: "[vue-test-utils]: could not overwrite
// property $apollo, this is usually caused by a plugin that has added
// the property as a read-only value"
// https://github.com/vuejs/vue-apollo/issues/798

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductDeleteForm.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper({ loading = false, propsData = {} } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(ProductDeleteForm, {
      localVue,
      router,
      vuetify,
      pinia: createTestingPinia(),
      mocks: {
        $apollo: {
          queries: {
            node: {
              loading: loading,
            },
          },
          mutate,
        },
      },
      propsData: {
        productId: 1013,
        ...propsData,
      },
      stubs: ["dev-tool-loading-state-overriding-menu"],
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
  });

  it("loading", async () => {
    const loading = true;
    const wrapper = createWrapper({ loading });
    await Vue.nextTick();
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });

  it("error", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      error: "Error message!",
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error message");
  });

  it("none", async () => {
    const wrapper = createWrapper();
    wrapper.setData({
      init: false,
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Not Found");
  });

  it("delete", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", "true");
    document.body.append(app);

    const wrapper: any = createWrapper();
    wrapper.setData({
      node: node,
    });
    const store = useStore();
    await wrapper.vm.remove();
    expect(wrapper.vm.$apollo.mutate).toBeCalled();
    expect(store.apolloMutationCalled).toHaveBeenCalled();
    expect(store.setSnackbarMessage).toHaveBeenCalled();
    expect(wrapper.emitted("finished")).toBeTruthy();
  });
});
