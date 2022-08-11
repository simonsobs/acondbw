import { defineStore } from "pinia";

import {
  signIn,
  signOut,
  restoreFromLocalStorage,
  isSignedIn,
} from "@/utils/auth";

interface GitHubViewer {
  login: string;
  name?: string;
  avatar_url?: string;
}

interface SignInInfo {
  gitHubViewer: GitHubViewer | null;
  isSignedIn: boolean;
  isAdmin: boolean;
}

// https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
interface OAuthError {
  error: string;
  error_description: string;
  error_uri: string;
}

interface AuthStoreState extends SignInInfo {
  token: string | null;
  lastError: OAuthError | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthStoreState => {
    const initialState: AuthStoreState = {
      token: null,
      gitHubViewer: null,
      isSignedIn: false,
      isAdmin: false,
      lastError: null,
    };
    try {
      const { token, signInInfo } = restoreFromLocalStorage();
      return {
        ...initialState,
        token,
        ...signInInfo,
      };
    } catch (error) {
      return initialState;
    }
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
      const error: OAuthError = (({ error, error_description, error_uri }) => ({
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
