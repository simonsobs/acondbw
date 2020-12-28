const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";

const AUTH_STATE = "auth-state";

export async function requestAuth(window, apolloClient) {
  try {
    const { data } = await apolloClient.query({ query: OAuthAppInfo });
    const oauthAppInfo = data.oauthAppInfo;
    const state = btoa(
      JSON.stringify({
        redirect: { name: "Auth" },
        code: cryptoRandomString({ length: 8, type: "url-safe" }),
      })
    );
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
    const params = {
      response_type: "code",
      client_id: oauthAppInfo.clientId,
      redirect_uri: oauthAppInfo.redirectUri,
      scope: "", // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
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
