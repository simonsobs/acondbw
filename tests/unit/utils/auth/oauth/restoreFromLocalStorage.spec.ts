import { describe, expect, it } from 'vitest'
import { AUTH_TOKEN } from "@/vue-apollo";

import { restoreFromLocalStorage } from "@/utils/auth";

describe("one", () => {
  const sampleToken = "xyz";
  const sampleTokenJson = JSON.stringify(sampleToken);
  const sampleSignInInfo = {
    gitHubViewer: {
      login: "octocat",
      name: "monalisa octocat",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
    },
    isSignedIn: true,
    isAdmin: false,
  };
  const sampleSignInInfoJson = JSON.stringify(sampleSignInInfo);
  const nullSignInInfo = {
    gitHubViewer: null,
    isSignedIn: false,
    isAdmin: false,
  };
  const sampleNullSignInInfoJson = JSON.stringify(nullSignInInfo);

  it("signed in", () => {
    localStorage.setItem(AUTH_TOKEN, sampleTokenJson);
    localStorage.setItem("sign-in-info", sampleSignInInfoJson);
    const { token, signInInfo } = restoreFromLocalStorage();
    expect(token).toBe(sampleToken);
    expect(signInInfo).toEqual(sampleSignInInfo);
    expect(localStorage.getItem(AUTH_TOKEN)).toBe(sampleTokenJson);
    expect(localStorage.getItem("sign-in-info")).toBe(sampleSignInInfoJson);
  });

  it("not signed in", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem("sign-in-info");
    const { token, signInInfo } = restoreFromLocalStorage();
    expect(token).toBe(null);
    expect(signInInfo).toEqual(nullSignInInfo);
  });

  it("only token", () => {
    localStorage.setItem(AUTH_TOKEN, sampleTokenJson);
    localStorage.removeItem("sign-in-info");
    const { token, signInInfo } = restoreFromLocalStorage();
    expect(token).toBe(null);
    expect(signInInfo).toEqual(nullSignInInfo);
    expect(localStorage.getItem(AUTH_TOKEN)).toBe(null);
    expect(localStorage.getItem("sign-in-info")).toBe(null);
  });

  it("only sign-in info", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.setItem("sign-in-info", sampleSignInInfoJson);
    const { token, signInInfo } = restoreFromLocalStorage();
    expect(token).toBe(null);
    expect(signInInfo).toEqual(nullSignInInfo);
    expect(localStorage.getItem(AUTH_TOKEN)).toBe(null);
    expect(localStorage.getItem("sign-in-info")).toBe(null);
  });

  it("throw", () => {
    const unparsable = "{123}";
    expect(() => {
      JSON.parse(unparsable);
    }).toThrow();
    localStorage.setItem(AUTH_TOKEN, unparsable);
    localStorage.setItem("sign-in-info", sampleSignInInfoJson);
    const { token, signInInfo } = restoreFromLocalStorage();
    expect(token).toBe(null);
    expect(signInInfo).toEqual(nullSignInInfo);
    expect(localStorage.getItem(AUTH_TOKEN)).toBe(null);
    expect(localStorage.getItem("sign-in-info")).toBe(null);
  });
});
