import { AUTH_STATE, validateState } from "@/utils/auth.js";

// using jest-localstorage-mock (https://www.npmjs.com/package/jest-localstorage-mock)
// to mock localStorage

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

  it("fail no state in localStorate", () => {
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
