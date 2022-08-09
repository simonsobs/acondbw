const querystring = require("querystring");
const cryptoRandomString = require("crypto-random-string");

import AddGitHubAdminAppToken from "@/graphql/mutations/AddGitHubAdminAppToken.gql";

const AUTH_ADMIN_STATE = "auth-state";

export async function storeAdminAppToken(code, state, apolloClient) {
  try {
    const authStateJson = localStorage.getItem(AUTH_ADMIN_STATE);
    const authState = authStateJson && JSON.parse(authStateJson);
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
