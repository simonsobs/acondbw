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

  const token = "xyz";
  const signInInfo = {
    gitHubViewer: {
      login: "octocat",
      name: "monalisa octocat",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
    },
    isSignedIn: true,
    isAdmin: false,
  };

  it("initial state signed in", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(token);
    expect(store.state.auth.gitHubViewer).toEqual(signInInfo.gitHubViewer);
  });

  it("initial state not signed in", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem("sign-in-info");
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.gitHubViewer).toBe(null);
  });

  it("initial state error only token", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.removeItem("sign-in-info");
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.gitHubViewer).toBe(null);
  });

  it("initial state error only sign-in info", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.gitHubViewer).toBe(null);
  });
});
