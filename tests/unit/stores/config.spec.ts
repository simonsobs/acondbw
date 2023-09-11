import { defineComponent, ref } from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { describe, expect, beforeEach, it } from "vitest";
import { PiniaVuePlugin, setActivePinia, createPinia } from "pinia";
import { fromValue, toPromise } from "wonka";
import { useConfigStore, VuetifyTheme, WebConfig } from "@/plugins/pinia/stores/config";

function callInSetup<T>(fn: () => T, urqlClient) {
  let ret: T | undefined;
  const dummyComponent = defineComponent({
    setup() {
      ret = fn();
    },
    render() {},
  });
  const localVue = createLocalVue();
  localVue.use(PiniaVuePlugin);
  mount(dummyComponent, {
    localVue,
    pinia: createPinia(),
    provide: { $urql: ref(urqlClient) },
  });
  if (ret === undefined) throw new Error("return value is undefined");
  return ret;
}

describe("Main Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const sampleVuetifyTheme: VuetifyTheme = {
    primary: "#009688",
    secondary: "#558B2F",
    "on-primary": "#FFFFFF",
    "on-secondary": "#FFFFFF",
  };

  const sampleWebConfig: WebConfig = {
    headTitle: "Product DB (localhost)",
    toolbarTitle: "Product DB (localhost)",
    devtoolLoadingstate: true,
    productCreationDialog: true,
    productUpdateDialog: true,
    productDeletionDialog: true,
    ...sampleVuetifyTheme,
  };

  const executeQuery = () =>
    fromValue({
      data: { webConfig: { json: JSON.stringify(sampleWebConfig) } },
    });

  const query = () => ({ toPromise: () => toPromise(executeQuery()) });

  const mockUrqlClient = { executeQuery, query };

  it("loadWebConfig()", async () => {
    const store = callInSetup(useConfigStore, mockUrqlClient);
    // await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.config).toEqual(sampleWebConfig);
    expect(store.vuetifyTheme).toEqual(sampleVuetifyTheme);
  });
});
