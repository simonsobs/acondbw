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
  const githubUser = {
    login: "octocat",
    name: "monalisa octocat",
    avatar_url: "https://github.com/images/error/octocat_happy.gif",
  };

it("initial state signed in", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.setItem("github-user", JSON.stringify(githubUser));
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(token);
    expect(store.state.auth.githubUser).toEqual(githubUser);
  });

  it("initial state not signed in", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem("github-user");
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.githubUser).toBe(null);
  });

  it("initial state error only token", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.removeItem("github-user");
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.githubUser).toBe(null);
  });

  it("initial state error only user", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.setItem("github-user", JSON.stringify(githubUser));
    const store = new Vuex.Store(cloneDeep(storeConfig));
    expect(store.state.auth.token).toBe(null);
    expect(store.state.auth.githubUser).toBe(null);
  });
});
