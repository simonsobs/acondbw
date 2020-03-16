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

  it("test /", () => {
    router.push("/");
    const current = router.history.current;
    expect(current.name).toBe("home");
    expect(current.path).toBe("/");
  });

  it("test /about", () => {
    router.push("/about");
    const pending = router.history.pending;
    expect(pending.name).toBe("about");
    expect(pending.path).toBe("/about");
    expect(pending.params).toEqual({});
  });

  it("test /maps/item/:name", () => {
    router.push("/maps/item/map001");
    const pending = router.history.pending;
    expect(pending.name).toBe("MapItem");
    expect(pending.path).toBe("/maps/item/map001");
    expect(pending.params).toEqual({
      name: "map001"
    });
  });

  it("test /maps", () => {
    router.push("/maps");
    const pending = router.history.pending;
    expect(pending.name).toBe("map");
    expect(pending.path).toBe("/maps");
    expect(pending.params).toEqual({});
  });

  it("test /beams/item/:name", () => {
    router.push("/beams/item/beam001");
    const pending = router.history.pending;
    expect(pending.name).toBe("BeamItem");
    expect(pending.path).toBe("/beams/item/beam001");
    expect(pending.params).toEqual({
      name: "beam001"
    });
  });

  it("test /beams", () => {
    router.push("/beams");
    const pending = router.history.pending;
    expect(pending.name).toBe("beam");
    expect(pending.path).toBe("/beams");
    expect(pending.params).toEqual({});
  });
});
