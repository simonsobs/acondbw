const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import OAuthAppInfo from "@/graphql/auth/OAuthAppInfo.gql";
import AddGitHubAdminAppToken from "@/graphql/admin-token/AddGitHubAdminAppToken.gql";

const AUTH_ADMIN_STATE = "auth-state";

export async function requestAuthForAdminApp(window, apolloClient) {
  try {
    const { data } = await apolloClient.query({
      query: OAuthAppInfo,
      variables: { admin: true },
    });
    const oauthAppInfo = data.oauthAppInfo;
    const state = cryptoRandomString({ length: 16, type: "url-safe" });
    localStorage.setItem(AUTH_ADMIN_STATE, JSON.stringify(state));
    const params = {
      response_type: "code",
      client_id: oauthAppInfo.clientId,
      redirect_uri: oauthAppInfo.redirectUri,
      scope: "read:org", // https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
      state: state,
    };
    let queryString = querystring.stringify(params);
    const uri = oauthAppInfo.authorizeUrl + "?" + queryString;
    window.location.href = uri;
  } catch (error) {
    localStorage.removeItem(AUTH_ADMIN_STATE);
    throw error;
  }
}

export async function storeAdminAppToken(code, state, apolloClient) {
  try {
    const authState = JSON.parse(localStorage.getItem(AUTH_ADMIN_STATE));
    if (!authState) {
      throw new Error("A state was not stored.");
    }
    if (!state) {
      throw new Error("A state was not returned.");
    }
    if (!(authState == state)) {
      throw new Error("The state did not match.");
    }
    const { data } = await apolloClient.mutate({
      mutation: AddGitHubAdminAppToken,
      variables: { code: code },
    });
    // const ok = data.StoreAdminAppToken.ok;
  } catch (error) {
    throw error;
  }
}
