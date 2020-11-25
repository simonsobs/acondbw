import moxios from "moxios";
import router from "@/router/index.js";

describe("About.vue", () => {
  const ENV_ORG = process.env;
  const ROUTER_HISTORY_CURRNT_ORG = router.history.current;

  beforeEach(() => {
    moxios.install();

    // Ideatly, VueRouter should be instantiated for each test.
    // But instead here, only the current and pending are set.
    router.history.current = { ...ROUTER_HISTORY_CURRNT_ORG };
    router.history.pending = null;
  });

  afterEach(() => {
    moxios.uninstall();
    router.history.current = ROUTER_HISTORY_CURRNT_ORG;
    router.history.pending = null;
  });

  it("test /", async () => {
    await router.push("/");
    const current = router.history.current;
    expect(current.name).toBe("Entry");
    expect(current.path).toBe("/");
  });

  it("test /about", async () => {
    await router.push("/about");
    const current = router.history.current;
    expect(current.name).toBe("About");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("test /map/item/:name", async () => {
    await router.push("/map/item/map001");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductItem");
    expect(current.path).toBe("/map/item/map001");
    expect(current.params).toEqual({
      productTypeName: "map",
      name: "map001",
    });
    expect(current.matched[0].props).toEqual({});
  });

  it("test /map", async () => {
    await router.push("/map");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("ProductList");
    expect(current.path).toBe("/map");
    expect(current.params).toEqual({
      productTypeName: "map",
    });
    expect(current.matched[0].props).toEqual({});
  });
});
