import { router } from "@/router";
import { AUTH_STATE, onRedirectedBack, UnencodedState } from "@/utils/auth";

describe("onRedirectedBack", () => {
  const callbackRoute = { name: "Auth" };

  const rawState: UnencodedState = {
    redirect: callbackRoute,
    code: "01234567-abcd-efgh-ijkl-mnopqrstuvwx",
  };

  const state = btoa(JSON.stringify(rawState));

  const query = { state: state };

  const locationOnError = { path: "/" };

  beforeEach(function () {
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
  });

  afterEach(function () {
    localStorage.clear();
  });

  it("success", async () => {
    await router.push({ name: "OAuthRedirect", query: query });
    const route = router.currentRoute;
    await onRedirectedBack(route, router, locationOnError);
    expect(router.currentRoute.name).toBe("Auth");
  });

  it("failure no query", async () => {
    await router.push({ name: "OAuthRedirect", query: {} });
    const route = router.currentRoute;
    await onRedirectedBack(route, router, locationOnError);
    expect(router.currentRoute.path).toBe("/");
  });

  it("failure invalid state", async () => {
    localStorage.setItem(AUTH_STATE, JSON.stringify("invalid-state"));
    await router.push({ name: "OAuthRedirect", query: query });
    const route = router.currentRoute;
    await onRedirectedBack(route, router, locationOnError);
    expect(router.currentRoute.path).toBe("/");
  });
});
