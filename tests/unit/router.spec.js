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
    expect(current.name).toBe("home");
    expect(current.path).toBe("/");
  });

  it("test /about", async () => {
    await router.push("/about");
    const current = router.history.current;
    expect(current.name).toBe("about");
    expect(current.path).toBe("/about");
    expect(current.params).toEqual({});
  });

  it("test /maps/item/:name", async () => {
    await router.push("/maps/item/map001");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("MapItem");
    expect(current.path).toBe("/maps/item/map001");
    expect(current.params).toEqual({
      name: "map001"
    });
  });

  it("test /maps", async () => {
    await router.push("/maps");
    const current = router.history.current;
    expect(current.matched.length).toBe(2);
    expect(current.name).toBe("MapList");
    expect(current.path).toBe("/maps");
    expect(current.params).toEqual({});
  });

  it("test /beams/item/:name", async () => {
    await router.push("/beams/item/beam001");
    const current = router.history.current;
    expect(current.name).toBe("BeamItem");
    expect(current.path).toBe("/beams/item/beam001");
    expect(current.params).toEqual({
      name: "beam001"
    });
  });

  it("test /beams", async () => {
    await router.push("/beams");
    const current = router.history.current;
    expect(current.name).toBe("BeamList");
    expect(current.path).toBe("/beams");
    expect(current.params).toEqual({});
  });
});
