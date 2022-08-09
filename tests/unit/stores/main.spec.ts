import { setActivePinia, createPinia } from "pinia";
import { useStore } from "@/stores/main";

describe("Main Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should be defined", () => {
    expect(useStore).toBeDefined();
  });

  it("dispatch loadExample", () => {
    const store = useStore();
    expect(store.example).toBe("abc");
    store.loadExample();
    expect(store.example).toBe("123");
  });

  it("dispatch apolloMutationCalled", () => {
    const store = useStore();
    expect(store.nApolloMutations).toBe(0);
    store.apolloMutationCalled();
    expect(store.nApolloMutations).toBe(1);
    store.apolloMutationCalled();
    expect(store.nApolloMutations).toBe(2);
  });
});
