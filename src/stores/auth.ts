import { defineStore } from "pinia";

import {
  signIn,
  signOut,
  restoreFromLocalStorage,
  isSignedIn,
} from "@/utils/auth";

function createInitialState() {
  try {
    const { token, signInInfo } = restoreFromLocalStorage();
    return {
      token,
      ...signInInfo,
    };
  } catch (error) {
    return {
      token: null,
      gitHubViewer: null,
      isSignedIn: false,
      isAdmin: false,
    };
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    const initialState = createInitialState();
    return {
      ...initialState,
      lastError: null,
    };
  },
  actions: {
    setSignInInfo(info) {
      this.gitHubViewer = info.gitHubViewer;
      this.isSignedIn = info.isSignedIn;
      this.isAdmin = info.isAdmin;
    },
    resetSignInInfo() {
      this.gitHubViewer = null;
      this.isSignedIn = false;
      this.isAdmin = false;
    },
    async checkIfSignedIn(apolloClient) {
      try {
        const result = await isSignedIn(apolloClient);
        if (result) {
          this.setSignInInfo(result);
          return;
        }
      } catch (error) {}
      this.signOut(apolloClient);
    },
    async signOut(apolloClient) {
      this.resetSignInInfo();
      this.token = null;
      await signOut(apolloClient);
    },
    async signIn({ code, state, apolloClient }) {
      this.lastError = null;
      try {
        const { token, signInInfo } = await signIn(code, state, apolloClient);
        this.token = token;
        this.setSignInInfo(signInInfo);
      } catch (error) {
        this.signOut(apolloClient);
        throw error;
      }
    },
    setRequestAuthError(query) {
      const error = (({ error, error_description, error_uri }) => ({
        error,
        error_description,
        error_uri,
      }))(query);
      this.lastError = error;
    },
    clearAuthError() {
      this.lastError = null;
    },
  },
});
