import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import ProductDeleteForm from "@/components/ProductDeleteForm.vue";
import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("ProductDeleteForm.vue", () => {
  let localVue;
  let vuetify;

  function createWrapper({ loading = false, propsData } = {}) {
    const mutate = jest.fn();
    let wrapper = mount(ProductDeleteForm, {
      localVue,
      router,
      vuetify,
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
        productTypeNameSingular: "map",
        productTypeNamePlural: "maps",
        productId: 1013,
        productName: "lat20200201",
        ...propsData,
      },
    });

    return wrapper;
  }

  const node = {
    id: "TWFwOjEwMTM=",
    productId: 1013,
    name: "lat20200201",
  };

  beforeEach(function() {
    localVue = createLocalVue();
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
      error: true,
    });
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Error: cannot load data");
  });

  it("none", async () => {
    const wrapper = createWrapper();
    await Vue.nextTick();
    expect(wrapper.text()).toContain("Nothing to show here");
  });

  it("delete", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.append(app);

    const wrapper = createWrapper();
    wrapper.setData({
      node: node,
    });
    await wrapper.vm.deleteProduct();
    expect(wrapper.vm.$apollo.mutate).toBeCalled();
    expect(wrapper.vm.dialogSuccess).toBe(true);
  });
});
