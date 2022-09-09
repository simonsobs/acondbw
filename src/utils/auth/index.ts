import { Client } from "@urql/vue";
import _ from "lodash";

import { AUTH_TOKEN } from "@/vue-apollo";

import QUERY_SIGN_IN_INFO from "@/graphql/queries/SignInInfo.gql";
import QUERY_IS_SIGNED_IN from "@/graphql/queries/IsSignedIn.gql";

import { exchangeCodeForToken } from "./oauth";

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

export async function isSignedIn(urqlClient: Client) {
  try {
    const { data } = await urqlClient.query(QUERY_IS_SIGNED_IN, {}).toPromise();
    if (data.isSignedIn) {
      const signInInfo = await getSignInInfo(urqlClient);
      localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
      return signInInfo;
    }
  } catch {}
  await signOut();
  return false;
}

export async function signOut() {
  // localStorage.removeItem(AUTH_TOKEN);
  localStorage.clear();
}

export async function signIn(
  code: string,
  state: string,
  urqlClient: Client
) {
  try {
    const token = await exchangeCodeForToken(code, state, urqlClient);
    localStorage.setItem(AUTH_TOKEN, token);
    const signInInfo = await getSignInInfo(urqlClient);
    localStorage.setItem("sign-in-info", JSON.stringify(signInInfo));
    return { token, signInInfo };
  } catch (error) {
    await signOut();
    throw error;
  }
}

export async function getSignInInfo(urqlClient: Client) {
  const { data } = await urqlClient.query(QUERY_SIGN_IN_INFO, {}).toPromise();
  return _.pick(data, ["isSignedIn", "isAdmin", "gitHubViewer"]);
}
