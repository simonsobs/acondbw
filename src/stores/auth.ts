import { ref } from "vue";
import { defineStore } from "pinia";
import { Client } from "@urql/vue";

import {
  SignInInfo,
  signIn as _signIn,
  signOut as _signOut,
  restoreFromLocalStorage,
  isSignedIn as _isSignedIn,
  GitHubViewer,
} from "@/utils/auth";

// https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
interface OAuthError {
  error: string;
  error_description: string;
  error_uri: string;
}

export const useAuthStore = defineStore("auth", () => {
  const gitHubViewer = ref<GitHubViewer | null>(null);
  const isSignedIn = ref<boolean>(false);
  const isAdmin = ref<boolean>(false);
  const token = ref<string | null>(null);
  const lastError = ref<OAuthError | null>(null);

  try {
    const { token: token_, signInInfo } = restoreFromLocalStorage();
    setSignInInfo(signInInfo);
    token.value = token_;
  } catch {
    resetSignInInfo();
    token.value = null;
  }

  function setSignInInfo(info: SignInInfo) {
    gitHubViewer.value = info.gitHubViewer;
    isSignedIn.value = info.isSignedIn;
    isAdmin.value = info.isAdmin;
  }

  function resetSignInInfo() {
    gitHubViewer.value = null;
    isSignedIn.value = false;
    isAdmin.value = false;
  }

  async function checkIfSignedIn(urqlClient: Client) {
    try {
      const result = await _isSignedIn(urqlClient);
      if (result) {
        setSignInInfo(result);
        return;
      }
    } catch {}
    await signOut();
  }

  async function signOut() {
    resetSignInInfo();
    token.value = null;
    await _signOut();
  }

  async function signIn(code: string, state: string, urqlClient: Client) {
    lastError.value = null;
    try {
      const { token: token_, signInInfo } = await _signIn(
        code,
        state,
        urqlClient
      );
      token.value = token_;
      setSignInInfo(signInInfo);
    } catch (error) {
      signOut();
      throw error;
    }
  }

  function setRequestAuthError(query: any) {
    const error: OAuthError = (({ error, error_description, error_uri }) => ({
      error,
      error_description,
      error_uri,
    }))(query);
    lastError.value = error;
  }

  function clearAuthError() {
    lastError.value = null;
  }

  return {
    gitHubViewer,
    isSignedIn,
    isAdmin,
    token,
    lastError,
    setSignInInfo,
    resetSignInInfo,
    checkIfSignedIn,
    signOut,
    signIn,
    setRequestAuthError,
    clearAuthError,
  };
});
