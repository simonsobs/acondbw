import { onLogin, onLogout, AUTH_TOKEN } from "@/vue-apollo";
import GitHubAuth from "@/graphql/auth/GitHubAuth.gql";
import GitHubUser from "@/graphql/auth/GitHubUser.gql";

function createInitialState() {
  const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
  const githubUser = JSON.parse(localStorage.getItem("github-user"));
  const ret = {
    token: token,
    githubUser: githubUser
  }
  return ret;
}

const initialState = createInitialState();

export const auth = {
  state: initialState,
  mutations: {
    set_token(state, token) {
      state.token = token;
    },
    set_github_user(state, githubUser) {
      state.githubUser = githubUser;
    }
  },
  actions: {
    async setToken({ commit }, { token, apolloClient }) {
      await onLogin(apolloClient, token);
      commit("set_token", token);
    },
    async signOut({ commit }, apolloClient) {
      localStorage.removeItem("github-user");
      commit("set_github_user", null);
      await onLogout(apolloClient);
      commit("set_token", null);
    },
    async obtainToken({ commit, dispatch }, { code, apolloClient }) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: GitHubAuth,
          variables: { code: code },
        });
        const authPayload = data.githubAuth.authPayload;
        const token = JSON.stringify(authPayload.token);
        await onLogin(apolloClient, token);
        commit("set_token", token);
        } catch (error) {
        console.log(error);
        dispatch("signOut", apolloClient);
        throw error;
      }
    },
    async loadGitHubUser({ commit, dispatch }, apolloClient) {
      try {
        const { data } = await apolloClient.query({ query: GitHubUser });
        const githubUser = data.githubUser;
        localStorage.setItem("github-user", JSON.stringify(githubUser));
        commit("set_github_user", githubUser);
      } catch (error) {
        dispatch("signOut", apolloClient);
        throw error;
      }
    },
  },
};
