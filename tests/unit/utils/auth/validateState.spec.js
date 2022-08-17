import { clearState, storeState, validateState } from "@/utils/auth";

describe("validateState", () => {
  afterEach(() => {
    clearState();
  });

  it("success", () => {
    const state = "abc";
    storeState(state);
    const result = validateState(state);
    expect(result).toBeTruthy();
  });

  it.each([null, ""])("fail empty %p", (state) => {
    storeState(state);
    const result = validateState(state);
    expect(result).toBeFalsy();
  });

  it("fail no state in localStorage", () => {
    const state = "abc";
    const result = validateState(state);
    expect(result).toBeFalsy();
  });

  it("fail doesn't match", () => {
    const state = "abc";
    storeState("xyz");
    const result = validateState(state);
    expect(result).toBeFalsy();
  });
});
