import moxios from "moxios";
import router from "@/router/index.js";

import store from "@/store";
jest.mock("@/store");

describe("router", () => {
  const ENV_ORG = process.env;
  const ROUTER_HISTORY_CURRNT_ORG = router.history.current;

  beforeEach(() => {
    moxios.install();

    // Ideally, VueRouter should be instantiated for each test.
    // But instead here, only the current and pending are set.
    router.history.current = { ...ROUTER_HISTORY_CURRNT_ORG };
    router.history.pending = null;

    store.state = { auth: { isSignedIn: false, isAdmin: false } };
  });

  afterEach(() => {
    moxios.uninstall();
    router.history.current = ROUTER_HISTORY_CURRNT_ORG;
    router.history.pending = null;
  });

  it("test /", async () => {
    store.state.auth.isSignedIn = true;
    try {
      await router.push("/");
    } catch (err) {
      // Error: Redirected when going from "/" to "/" via a navigation guard.
      // https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
    }
    const current = router.history.current;
    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test / not sigend in", async () => {
    await router.push("/");
    const current = router.history.current;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test /dashboard", async () => {
    store.state.auth.isSignedIn = true;
    await router.push("/dashboard");
    const current = router.history.current;
    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test /dashboard not sigend in", async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {}
    const current = router.history.current;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test requiresAuth", async () => {
    try {
      await router.push("/product/map");
    } catch (err) {}
    // not sure how to await for pending to become current
    const pending = router.history.pending;
    expect(pending.name).toBe("AccessDenied");
    expect(pending.path).toBe("/access-denied");
  });

  it("test requiresAdmin", async () => {
    store.state.auth.isSignedIn = true;
    try {
      await router.push("/admin/log");
    } catch (err) {}
    const current = router.history.current;
    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("test /about", async () => {
    await router.push("/about");
    const current = router.history.current;
    expect(current.name).toBe("About");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("test 404", async () => {
    store.state.auth.isSignedIn = true;
    await router.push("/no-such-path");
    const current = router.history.current;
    expect(current.name).toBe("NotFound");
    expect(current.path).toBe("/no-such-path");
    expect(current.params).toEqual({ pathMatch: "/no-such-path" });
  });

  it("test /product/map/:name", async () => {
    store.state.auth.isSignedIn = true;
    await router.push("/product/map/map001");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductItem");
    expect(current.path).toBe("/product/map/map001");
    expect(current.params).toEqual({
      productTypeName: "map",
      name: "map001",
    });
    expect(current.matched[0].props).toEqual({});
  });

  it("test /product/map", async () => {
    store.state.auth.isSignedIn = true;
    await router.push("/product/map");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductList");
    expect(current.path).toBe("/product/map");
    expect(current.params).toEqual({
      productTypeName: "map",
    });
    expect(current.matched[0].props).toEqual({});
  });
});
