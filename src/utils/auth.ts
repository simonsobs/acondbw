import VueRouter, { Route, RawLocation, Location } from "vue-router";
import { DollarApollo } from "vue-apollo/types/vue-apollo";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import { apolloClient, onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
export const AUTH_STATE = "auth-state";

import QUERY_GIT_HUB_O_AUTH_APP_INFO from "@/graphql/queries/GitHubOAuthAppInfo.gql";
import MUTATE_AUTHENTICATE_WITH_GIT_HUB from "@/graphql/mutations/AuthenticateWithGitHub.gql";
import QUERY_SIGN_IN_INFO from "@/graphql/queries/SignInInfo.gql";
import QUERY_IS_SIGNED_IN from "@/graphql/queries/IsSignedIn.gql";

export interface GitHubViewer {
  login: string;
  name?: string;
  avatar_url?: string;
}

export interface SignInInfo {
  gitHubViewer: GitHubViewer | null;
  isSignedIn: boolean;
  isAdmin: boolean;
}

// OAuth2 authorization request parameters
// https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
type RequestParams = {
  response_type: "code";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
};

export interface UnencodedState {
  redirect: Location;
  randomString: string;
}

/**
 *
 * @param apolloClient - an apollo client
 * @param callbackRoute - a route to be redirected from the registered callback route
 * @param scope - scopes as described in https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
 */
export async function redirectToGitHubAuthURL(
  apolloClient: DollarApollo<any>,
  callbackRoute: Location,
  scope: string
) {
  const rawState: UnencodedState = {
    redirect: callbackRoute,
    randomString: uuidv4(),
  };
  const state = encodeState(rawState);
  try {
    const { data } = await apolloClient.query({
      query: QUERY_GIT_HUB_O_AUTH_APP_INFO,
    });
    const gitHubOAuthAppInfo = data.gitHubOAuthAppInfo;
    const params: RequestParams = {
      response_type: "code",
      client_id: gitHubOAuthAppInfo.clientId,
      redirect_uri: gitHubOAuthAppInfo.redirectUri,
      scope: scope,
      state: state,
    };
    const queryString = new URLSearchParams(params).toString();
    const uri = gitHubOAuthAppInfo.authorizeUrl + "?" + queryString;
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
    window.location.assign(uri);
  } catch (error) {
    localStorage.removeItem(AUTH_STATE);
    throw error;
  }
}

function encodeState(rawState: UnencodedState) {
  const jsonString = JSON.stringify(rawState);
  return btoa(jsonString);
}

export function validateAndDecodeState(state: any) {
  if (typeof state !== "string") return null;
  if (!validateState(state)) return null;
  return decodeState(state);
}

function decodeState(state: string) {
  const jsonString = atob(state);
  const rawState: UnencodedState = JSON.parse(jsonString);
  return rawState;
}

/**
 * Validate the state by comparing the one stored in localStorage
 * @param state - the state returned from the auth server
 * @returns true if validated
 */
export function validateState(state: string) {
  if (!state) return false;
  const stored = localStorage.getItem(AUTH_STATE);
  if (!(stored === JSON.stringify(state))) return false;
  return true;
}

export function restoreFromLocalStorage() {
  try {
    const tokenJson = localStorage.getItem(AUTH_TOKEN);
    const signInInfoJson = localStorage.getItem("sign-in-info");
    const token = tokenJson && (JSON.parse(tokenJson) as string);
    const signInInfo =
      signInInfoJson && (JSON.parse(signInInfoJson) as SignInInfo);

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
    token: null as string | null,
    signInInfo: {
      gitHubViewer: null,
      isSignedIn: false,
      isAdmin: false,
    } as SignInInfo,
  };
}

export async function isSignedIn(apolloClient: DollarApollo<any>) {
  try {
    const { data } = await apolloClient.query({ query: QUERY_IS_SIGNED_IN });
    if (data.isSignedIn) {
      const signInInfo = await getSignInInfo();
      localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
      return signInInfo;
    }
  } catch {}
  await signOut(apolloClient);
  return false;
}

export async function signOut(apolloClient: DollarApollo<any>) {
  await onLogout(apolloClient);
  localStorage.clear();
}

export async function signIn(
  code: string,
  state: string,
  apolloClient: DollarApollo<any>
) {
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

export async function exchangeCodeForToken(
  code: string,
  state: string,
  apolloClient: DollarApollo<any>
) {
  if (!validateState(state)) {
    throw new Error("The state was invalid.");
  }
  const { data } = await apolloClient.mutate({
    mutation: MUTATE_AUTHENTICATE_WITH_GIT_HUB,
    variables: { code: code },
  });
  const authPayload = data.authenticateWithGitHub.authPayload;
  const token = JSON.stringify(authPayload.token);
  return token;
}

export async function getSignInInfo() {
  const { data } = await apolloClient.query({ query: QUERY_SIGN_IN_INFO });
  return _.pick(data, ["isSignedIn", "isAdmin", "gitHubViewer"]);
}
