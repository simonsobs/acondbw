import { Client } from "@urql/vue";
import { Location } from "vue-router";

import QUERY_GIT_HUB_O_AUTH_APP_INFO from "@/graphql/queries/GitHubOAuthAppInfo.gql";
import MUTATE_AUTHENTICATE_WITH_GIT_HUB from "@/graphql/mutations/AuthenticateWithGitHub.gql";

const AUTH_STATE = "auth-state";

export interface UnencodedState {
  redirect: Location;
  option: string;
}

export function encodeAndStoreState(rawState: UnencodedState) {
  const state = encodeState(rawState);
  storeState(state);
  return state;
}

export function validateAndDecodeState(state: any) {
  if (typeof state !== "string") return null;
  if (!validateState(state)) return null;
  return decodeState(state);
}

export function clearState() {
  localStorage.removeItem(AUTH_STATE);
}

function encodeState(rawState: UnencodedState) {
  const jsonString = JSON.stringify(rawState);
  return btoa(jsonString);
}

export function decodeState(state: string) {
  const jsonString = atob(state);
  const rawState: UnencodedState = JSON.parse(jsonString);
  return rawState;
}

export function storeState(state: string) {
  localStorage.setItem(AUTH_STATE, JSON.stringify(state));
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

// OAuth2 authorization request parameters
// https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
type RequestParams = {
  response_type: "code";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
};

/**
 *
 * @param urqlClient - a urql client
 * @param scope - scopes as described in https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
 * @param state - the state parameter of OAuth2 authorization request
 */
export async function redirectToGitHubAuthURL(
  urqlClient: Client,
  scope: string,
  state: string
) {
  const { data } = await urqlClient
    .query(QUERY_GIT_HUB_O_AUTH_APP_INFO, {})
    .toPromise();
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
  window.location.assign(uri);
}

export async function exchangeCodeForToken(
  code: string,
  state: string,
  urqlClient: Client
) {
  if (!validateState(state)) {
    throw new Error("The state was invalid.");
  }
  const { data } = await urqlClient
    .mutation(MUTATE_AUTHENTICATE_WITH_GIT_HUB, { code: code })
    .toPromise();
  const authPayload = data.authenticateWithGitHub.authPayload;
  const token = JSON.stringify(authPayload.token);
  return token;
}
