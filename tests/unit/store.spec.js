import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";

import { storeConfig } from "@/store/index.js";

describe("store", () => {
  let localVue;
  let store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  it("commit set_example", () => {
    expect(store.state.example).toBe("abc");
    store.commit("set_example", "xyz");
    expect(store.state.example).toBe("xyz");
  });

  it("dispatch loadExample success", () => {
    expect(store.state.example).toBe("abc");
    store.dispatch("loadExample");
    expect(store.state.example).toBe("123");
  });

  it("dispatch apolloMutationCalled", () => {
    expect(store.state.nApolloMutations).toBe(0);
    store.dispatch("apolloMutationCalled");
    expect(store.state.nApolloMutations).toBe(1);
    store.dispatch("apolloMutationCalled");
    expect(store.state.nApolloMutations).toBe(2);
  });
});
