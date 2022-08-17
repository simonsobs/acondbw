import { AUTH_STATE, validateState } from "@/utils/auth";

describe("validateState", () => {
  afterEach(() => {
    localStorage.removeItem(AUTH_STATE);
  });

  it("success", () => {
    const state = "abc";
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
    const result = validateState(state);
    expect(result).toBeTruthy();
  });

  it.each([null, ""])("fail empty %p", (state) => {
    localStorage.setItem(AUTH_STATE, JSON.stringify("abc"));
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
    localStorage.setItem(AUTH_STATE, JSON.stringify("xyz"));
    const result = validateState(state);
    expect(result).toBeFalsy();
  });
});
