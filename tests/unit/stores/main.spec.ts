import { describe, expect, beforeEach, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useStore } from "@/stores/main";

describe("Main Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
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
