import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";

import { AUTH_TOKEN } from "@/vue-apollo";
import { storeConfig } from "@/store/index.js";

// using jest-localstorage-mock (https://www.npmjs.com/package/jest-localstorage-mock)
// to mock localStorage

describe("store", () => {
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  it("localStoreage token", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify("xyz"))
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe("xyz");
  });

});
