import { DollarApollo } from "vue-apollo/types/vue-apollo";
import _ from "lodash";

import { apolloClient, onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";

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

export async function getSignInInfo() {
  const { data } = await apolloClient.query({ query: QUERY_SIGN_IN_INFO });
  return _.pick(data, ["isSignedIn", "isAdmin", "gitHubViewer"]);
}
