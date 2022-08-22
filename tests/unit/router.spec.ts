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

  it("Entry - signed in", async () => {
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

  it("Entry - not signed in", async () => {
    await router.push("/");

    const current = router.currentRoute;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("Dashboard - signed in", async () => {
    authStore.isSignedIn = true;
    await router.push("/dashboard");

    const current = router.currentRoute;
    expect(current.name).toBe("Dashboard");
    expect(current.path).toBe("/dashboard");
  });

  it("Dashboard - not signed in", async () => {
    try {
      await router.push("/dashboard");
    } catch (err) {}

    const current = router.currentRoute;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("requiresAuth - signed in", async () => {
    authStore.isSignedIn = true;
    await router.push("/product/map");

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 10));

    const current = router.currentRoute;
    expect(current.path).toBe("/product/map");
  });

  it("requiresAuth - not signed in", async () => {
    try {
      await router.push("/product/map");
    } catch (err) {}

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 10));

    const current = router.currentRoute;
    expect(current.name).toBe("SignInRequired");
    expect(current.path).toBe("/sign-in-required");
  });

  it("requiresAdmin - not signed in", async () => {
    try {
      await router.push("/admin/log");
    } catch (err) {}

    const current = router.currentRoute;
    expect(current.name).toBe("SignInRequired");
    expect(current.path).toBe("/sign-in-required");
  });

  it("requiresAdmin - signed in - not admin", async () => {
    authStore.isSignedIn = true;
    try {
      await router.push("/admin/log");
    } catch (err) {}

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 10));

    const current = router.currentRoute;
    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("requiresAdmin - signed in - admin", async () => {
    authStore.isSignedIn = true;
    authStore.isAdmin = true;
    await router.push("/admin/log");

    const current = router.currentRoute;
    expect(current.path).toBe("/admin/log");
  });

  it("AccessDenied - not signed in", async () => {
    try {
      await router.push({ name: "AccessDenied" });
    } catch (err) {}

    const current = router.currentRoute;
    expect(current.name).toBe("SignInRequired");
    expect(current.path).toBe("/sign-in-required");
  });

  it("AccessDenied - signed in", async () => {
    authStore.isSignedIn = true;
    await router.push({ name: "AccessDenied" });

    const current = router.currentRoute;
    expect(current.name).toBe("AccessDenied");
    expect(current.path).toBe("/access-denied");
  });

  it("About", async () => {
    await router.push("/about");

    const current = router.currentRoute;
    expect(current.name).toBe("About");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("404", async () => {
    authStore.isSignedIn = true;
    await router.push("/no-such-path");

    const current = router.currentRoute;
    expect(current.name).toBe("NotFound");
    expect(current.path).toBe("/no-such-path");
    expect(current.params).toEqual({ pathMatch: "/no-such-path" });
  });

  it("ProductItem", async () => {
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

  it("ProductList", async () => {
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
