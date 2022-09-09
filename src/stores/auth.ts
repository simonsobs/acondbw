import { defineStore } from "pinia";
import { Client } from "@urql/vue";

import {
  SignInInfo,
  signIn,
  signOut,
  restoreFromLocalStorage,
  isSignedIn,
} from "@/utils/auth";

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
    async checkIfSignedIn(urqlClient: Client) {
      try {
        const result = await isSignedIn(urqlClient);
        if (result) {
          this.setSignInInfo(result);
          return;
        }
      } catch (error) {}
      this.signOut();
    },
    async signOut() {
      this.resetSignInInfo();
      this.token = null;
      await signOut();
    },
    async signIn(
      code: string,
      state: string,
      urqlClient: Client
    ) {
      this.lastError = null;
      try {
        const { token, signInInfo } = await signIn(code, state, urqlClient);
        console.log("authStore signIn() signInInfo:", signInInfo)
        this.token = token;
        this.setSignInInfo(signInInfo);
      } catch (error) {
        this.signOut();
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
