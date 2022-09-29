import { describe, expect, beforeEach, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { fromValue, toPromise } from "wonka";
import { useConfigStore, VuetifyTheme, WebConfig } from "@/stores/config";

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
    const store = useConfigStore();
    expect(store.vuetifyTheme).toEqual({});
    //
    // @ts-ignore
    store.client = mockUrqlClient;
    
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(store.webConfig).toEqual(sampleWebConfig);
    expect(store.vuetifyTheme).toEqual(sampleVuetifyTheme);
  });
});
