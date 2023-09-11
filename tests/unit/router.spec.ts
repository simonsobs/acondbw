import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import moxios from "moxios";

import { createRouter } from "@/plugins/router";
import { useAuthStore } from "@/stores/auth";

describe("router", () => {
  let authStore: ReturnType<typeof useAuthStore>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    moxios.install();

    authStore = useAuthStore();
    authStore.isSignedIn = false;
    authStore.isAdmin = false;

    router = createRouter();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("Entry - signed in", async () => {
    authStore.isSignedIn = true;

    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push("/")).rejects.toThrow();

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
    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push("/dashboard")).rejects.toThrow();

    const current = router.currentRoute;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("requiresAuth - signed in", async () => {
    authStore.isSignedIn = true;
    await router.push("/product/map");

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 100));

    const current = router.currentRoute;
    expect(current.path).toBe("/product/map");
  });

  it("requiresAuth - not signed in", async () => {
    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push("/product/map")).rejects.toThrow();

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 100));

    const current = router.currentRoute;
    expect(current.name).toBe("SignInRequired");
    expect(current.path).toBe("/sign-in-required");
    expect(current.query).toEqual({ path: "/product/map" });
  });

  it("requiresAdmin - not signed in", async () => {
    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push("/admin/log")).rejects.toThrow();

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 100));

    const current = router.currentRoute;
    expect(current.name).toBe("SignInRequired");
    expect(current.path).toBe("/sign-in-required");
    expect(current.query).toEqual({ path: "/admin/log" });
  });

  it("requiresAdmin - signed in - not admin", async () => {
    authStore.isSignedIn = true;
    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push("/admin/log")).rejects.toThrow();

    // sleep so pending to become current
    await new Promise((resolve) => setTimeout(resolve, 100));

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
    // https://stackoverflow.com/q/62223195/7309855
    await expect(router.push({ name: "AccessDenied" })).rejects.toThrow();

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
