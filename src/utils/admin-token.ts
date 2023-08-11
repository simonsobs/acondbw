import { Client } from "@urql/vue";

import { AddGitHubAdminAppTokenDocument } from "@/generated/graphql";

const AUTH_ADMIN_STATE = "auth-state";

export async function storeAdminAppToken(
  code,
  state,
  urqlClient: Client
) {
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
  const { error } = await urqlClient
    .mutation(AddGitHubAdminAppTokenDocument, { code: code })
    .toPromise();
  if (error) throw error;
}
