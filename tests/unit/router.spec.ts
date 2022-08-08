import moxios from "moxios";
import { router, setPinia, setDefaultPinia } from "@/router/index";
import { setActivePinia, createPinia } from "pinia";

import { useAuthStore } from "@/stores/auth";

describe("router", () => {
  let authStore;

  const ENV_ORG = process.env;

  // @ts-ignore
  const ROUTER_HISTORY_CURRENT_ORG = router.history.current;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    setPinia(pinia);
    moxios.install();

    authStore = useAuthStore();

    // Ideally, VueRouter should be instantiated for each test.
    // But instead here, only the current and pending are set.

    // @ts-ignore
    router.history.current = { ...ROUTER_HISTORY_CURRENT_ORG };

    // @ts-ignore
    router.history.pending = null;

    // store.state = { auth: { isSignedIn: false, isAdmin: false } };
    authStore.isSignedIn = false;
    authStore.isAdmin = false;
  });

  afterEach(() => {
    setDefaultPinia();
    moxios.uninstall();

    // @ts-ignore
    router.history.current = ROUTER_HISTORY_CURRENT_ORG;

    // @ts-ignore
    router.history.pending = null;
  });

  it("test /", async () => {
    authStore.isSignedIn = true;
    try {
      await router.push("/");
    } catch (err) {
      // Error: Redirected when going from "/" to "/" via a navigation guard.
      // https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
    }

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test / not signed in", async () => {
    await router.push("/");

    // @ts-ignore
    const current = router.history.current;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test /dashboard", async () => {
    authStore.isSignedIn = true;
    await router.push("/dashboard");

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test /dashboard not signed in", async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {}

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test requiresAuth", async () => {
    try {
      await router.push("/product/map");
    } catch (err) {}
    // not sure how to await for pending to become current

    // @ts-ignore
    const pending = router.history.pending;

    expect(pending.name).toBe("AccessDenied");
    expect(pending.path).toBe("/access-denied");
  });

  it("test requiresAdmin", async () => {
    authStore.isSignedIn = true;
    try {
      await router.push("/admin/log");
    } catch (err) {}

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("test /about", async () => {
    await router.push("/about");

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("About");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("test 404", async () => {
    authStore.isSignedIn = true;
    await router.push("/no-such-path");

    // @ts-ignore
    const current = router.history.current;

    expect(current.name).toBe("NotFound");
    expect(current.path).toBe("/no-such-path");
    expect(current.params).toEqual({ pathMatch: "/no-such-path" });
  });

  it("test /product/map/:name", async () => {
    authStore.isSignedIn = true;
    await router.push("/product/map/map001");

    // @ts-ignore
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
    authStore.isSignedIn = true;
    await router.push("/product/map");

    // @ts-ignore
    const current = router.history.current;
    0;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductList");
    expect(current.path).toBe("/product/map");
    expect(current.params).toEqual({
      productTypeName: "map",
    });
    expect(current.matched[0].props).toEqual({});
  });
});
