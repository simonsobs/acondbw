const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");
import _ from "lodash";

import { apolloClient, onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
export const AUTH_STATE = "auth-state";

import GitHubOAuthAppInfo from "@/graphql/queries/GitHubOAuthAppInfo.gql";
import AuthenticateWithGitHub from "@/graphql/mutations/AuthenticateWithGitHub.gql";
import GitHubViewer from "@/graphql/queries/GitHubViewer.gql";
import SignInInfo from "@/graphql/queries/SignInInfo.gql";
import IsSignedIn from "@/graphql/queries/IsSignedIn.gql";

/**
 *
 * @param {object} window - the window object
 * @param {object} apolloClient - an apollo client
 * @param {object} callbackRoute - a route to be redirected from the rigistered callback route
 * @param {string} scope - scopes as described in https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
 */
export async function redirectToGitHubAuthURL(
  window,
  apolloClient,
  callbackRoute,
  scope
) {
  try {
    const { data } = await apolloClient.query({ query: GitHubOAuthAppInfo });
    const gitHubOAuthAppInfo = data.gitHubOAuthAppInfo;
    const code = cryptoRandomString({ length: 8, type: "url-safe" });
    const state = btoa(
      JSON.stringify({
        redirect: callbackRoute,
        code: code,
      })
    );
    const params = {
      response_type: "code",
      client_id: gitHubOAuthAppInfo.clientId,
      redirect_uri: gitHubOAuthAppInfo.redirectUri,
      scope: scope,
      state: state,
    };
    let queryString = querystring.stringify(params);
    const uri = gitHubOAuthAppInfo.authorizeUrl + "?" + queryString;
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
    window.location.href = uri;
  } catch (error) {
    localStorage.removeItem(AUTH_STATE);
    throw error;
  }
}

/**
 * Validate the state by comparing the one stored in localStorage
 * @param {string} state - the state returned from the auth server
 * @returns {boolean} true if validated
 */
export function validateState(state) {
  if (!state) {
    return false;
  }
  const authState = JSON.parse(localStorage.getItem(AUTH_STATE));
  if (!authState) {
    return false;
  }
  if (!(authState == state)) {
    return false;
  }
  return true;
}

export function restoreFromLocalStorage() {
  try {
    const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
    const signInInfo = JSON.parse(localStorage.getItem("sign-in-info"));

    if (token && signInInfo) {
      return { token, signInInfo };
    }
  } catch {
    localStorage.clear();
  }

  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem("sign-in-info");
  // do not call localStorage.clear() here because it will delete
  // AUTH_STATE when redirected from the auth server

  return {
    token: null,
    signInInfo: { gitHubViewer: null, isSignedIn: false, isAdmin: false },
  };
}

export async function isSignedIn(apolloClient) {
  try {
    const { data } = await apolloClient.query({ query: IsSignedIn });
    if (data.isSignedIn) {
      const signInInfo = await getSignInInfo();
      localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
      return signInInfo;
    }
  } catch {}
  await signOut(apolloClient);
  return false;
}

export async function signOut(apolloClient) {
  await onLogout(apolloClient);
  localStorage.clear();
}

export async function signIn(code, state, apolloClient) {
  try {
    const token = await exchangeCodeForToken(code, state, apolloClient);
    await onLogin(apolloClient, token);
    const signInInfo = await getSignInInfo();
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    return { token, signInInfo };
  } catch (error) {
    await signOut(apolloClient);
    throw error;
  }
}

export async function exchangeCodeForToken(code, state, apolloClient) {
  if (!validateState(state)) {
    throw new Error("The state was invalid.");
  }
  const { data } = await apolloClient.mutate({
    mutation: AuthenticateWithGitHub,
    variables: { code: code },
  });
  const authPayload = data.authenticateWithGitHub.authPayload;
  const token = JSON.stringify(authPayload.token);
  return token;
}

export async function getSignInInfo() {
  const { data } = await apolloClient.query({ query: SignInInfo });
  return _.pick(data, ["isSignedIn", "isAdmin", "gitHubViewer"]);
}
