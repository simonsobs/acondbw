import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { fromValue, toPromise } from "wonka";
import { useStore, VuetifyTheme, WebConfig } from "@/stores/main";

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
    const store = useStore();
    expect(store.webConfigLoaded).toBe(false);
    expect(store.vuetifyTheme).toEqual({});
    // @ts-ignore
    await store.loadWebConfig(mockUrqlClient);
    expect(store.webConfigLoaded).toBe(true);
    expect(store.webConfig).toEqual(sampleWebConfig);
    expect(store.vuetifyTheme).toEqual(sampleVuetifyTheme);
  });

  it("loadExample()", () => {
    const store = useStore();
    expect(store.example).toBe("abc");
    store.loadExample();
    expect(store.example).toBe("123");
  });

  it("apolloMutationCalled()", () => {
    const store = useStore();
    expect(store.nApolloMutations).toBe(0);
    store.apolloMutationCalled();
    expect(store.nApolloMutations).toBe(1);
    store.apolloMutationCalled();
    expect(store.nApolloMutations).toBe(2);
  });
});
