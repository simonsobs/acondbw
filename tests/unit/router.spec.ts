import { setActivePinia, createPinia } from "pinia";
import moxios from "moxios";

import { createRouter, setPinia, setDefaultPinia } from "@/router";
import { useAuthStore } from "@/stores/auth";

describe("router", () => {
  let authStore: ReturnType<typeof useAuthStore>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    setPinia(pinia);
    moxios.install();

    authStore = useAuthStore();
    authStore.isSignedIn = false;
    authStore.isAdmin = false;

    router = createRouter();
  });

  afterEach(() => {
    setDefaultPinia();
    moxios.uninstall();
  });

  it("test /", async () => {
    authStore.isSignedIn = true;
    try {
      await router.push("/");
    } catch (err) {
      // Error: Redirected when going from "/" to "/" via a navigation guard.
      // https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a
    }

    const current = router.currentRoute;
    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test / not signed in", async () => {
    await router.push("/");

    const current = router.currentRoute;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test /dashboard", async () => {
    authStore.isSignedIn = true;
    await router.push("/dashboard");

    const current = router.currentRoute;
    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("test /dashboard not signed in", async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {}

    const current = router.currentRoute;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test requiresAuth", async () => {
    try {
      await router.push("/product/map");
    } catch (err) {}

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 10));

    const current = router.currentRoute;
    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("test requiresAdmin", async () => {
    authStore.isSignedIn = true;
    try {
      await router.push("/admin/log");
    } catch (err) {}

    const current = router.currentRoute;
    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("test /about", async () => {
    await router.push("/about");

    const current = router.currentRoute;
    expect(current.name).toBe("About");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("test 404", async () => {
    authStore.isSignedIn = true;
    await router.push("/no-such-path");

    const current = router.currentRoute;
    expect(current.name).toBe("NotFound");
    expect(current.path).toBe("/no-such-path");
    expect(current.params).toEqual({ pathMatch: "/no-such-path" });
  });

  it("test /product/map/:name", async () => {
    authStore.isSignedIn = true;
    await router.push("/product/map/map001");

    const current = router.currentRoute;
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

    const current = router.currentRoute;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductList");
    expect(current.path).toBe("/product/map");
    expect(current.params).toEqual({
      productTypeName: "map",
    });
    expect(current.matched[0].props).toEqual({});
  });
});
