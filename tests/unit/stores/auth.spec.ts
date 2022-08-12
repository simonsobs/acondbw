import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

import { AUTH_TOKEN } from "@/vue-apollo";

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const token = "xyz";
  const signInInfo = {
    gitHubViewer: {
      login: "octocat",
      name: "monalisa octocat",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
    },
    isSignedIn: true,
    isAdmin: false,
  };

  it("initial state signed in", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    const authStore = useAuthStore();
    expect(authStore.token).toBe(token);
    expect(authStore.gitHubViewer).toEqual(signInInfo.gitHubViewer);
  });

  it("initial state not signed in", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem("sign-in-info");
    const authStore = useAuthStore();
    expect(authStore.token).toBe(null);
    expect(authStore.gitHubViewer).toBe(null);
  });

  it("initial state error only token", () => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.removeItem("sign-in-info");
    const authStore = useAuthStore();
    expect(authStore.token).toBe(null);
    expect(authStore.gitHubViewer).toBe(null);
  });

  it("initial state error only sign-in info", () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    const authStore = useAuthStore();
    expect(authStore.token).toBe(null);
    expect(authStore.gitHubViewer).toBe(null);
  });
});
