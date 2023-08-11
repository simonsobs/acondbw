import { Client } from "@urql/vue";
import _ from "lodash";

import { SignInInfoDocument, IsSignedInDocument } from "@/generated/graphql";

import { exchangeCodeForToken } from "./oauth";

const AUTH_TOKEN = "apollo-token";

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

export function readTokenFromLocalStorage() {
  const tokenJson = localStorage.getItem(AUTH_TOKEN);
  return tokenJson && (JSON.parse(tokenJson) as string);
}

export function restoreFromLocalStorage() {
  try {
    const signInInfoJson = localStorage.getItem("sign-in-info");
    const token = readTokenFromLocalStorage();
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
    const { error, data } = await urqlClient
      .query(IsSignedInDocument, {})
      .toPromise();
    if (error) throw error;
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

export async function signIn(code: string, state: string, urqlClient: Client) {
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
  const { error, data } = await urqlClient
    .query(SignInInfoDocument, {})
    .toPromise();
  if (error) throw error;
  return _.pick(data, ["isSignedIn", "isAdmin", "gitHubViewer"]);
}
