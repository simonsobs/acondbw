import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import VTextFieldWithDatePicker from "@/components/VTextFieldWithDatePicker";

Vue.use(Vuetify);

describe("VTextFieldWithDatePicker.vue", () => {
  let localVue;
  let vuetify;

  beforeEach(function() {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  function createWrapper() {
    let wrapper = mount(VTextFieldWithDatePicker, {
      localVue,
      vuetify,
      propsData: {
        label: "Date produced",
        value: "2020-07-02",
      },
    });

    return wrapper;
  }

  it("match snapshot", async () => {
    // to suppress the warning "[Vuetify] Unable to locate target [data-app]""
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.append(app);

    const wrapper = createWrapper();
    wrapper.setData({
      menu: true,
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
