const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";

export const AUTH_STATE = "auth-state";

/**
 *
 * @param {object} window - the window object
 * @param {object} apolloClient - an apollo client
 * @param {object} callbackRoute - a route to be redirected from the rigistered callback route
 * @param {string} scope - scopes as described in https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
 */
export async function redirectToGitHubAuthURL(window, apolloClient, callbackRoute, scope) {
  try {
    const { data } = await apolloClient.query({ query: OAuthAppInfo });
    const oauthAppInfo = data.oauthAppInfo;
    const state = btoa(
      JSON.stringify({
        redirect: callbackRoute,
        code: cryptoRandomString({ length: 8, type: "url-safe" }),
      })
    );
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
    const params = {
      response_type: "code",
      client_id: oauthAppInfo.clientId,
      redirect_uri: oauthAppInfo.redirectUri,
      scope: scope,
      state: state,
    };
    let queryString = querystring.stringify(params);
    const uri = oauthAppInfo.authorizeUrl + "?" + queryString;
    window.location.href = uri;
  } catch (error) {
    localStorage.removeItem(AUTH_STATE);
    throw error;
  }
}

export function validateState(state) {
  const authState = JSON.parse(localStorage.getItem(AUTH_STATE));
  if (!authState) {
    return false;
  }
  if (!(authState == state)) {
    return false;
  }
  return true;
}
