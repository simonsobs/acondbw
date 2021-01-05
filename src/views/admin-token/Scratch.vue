<template>
  <v-container fill-height fluid>
    <v-card flat>
      <v-card-actions>
        <v-btn block outlined @click="updateOrgMemberList">
          <v-icon left>mdi-github</v-icon>Update org member list
        </v-btn>
      </v-card-actions>
      <v-card>
        <v-card-title>Tokens with org access</v-card-title>
        <v-card-text>
          <template v-if="allGitHubTokens">
            <v-data-table
              :headers="allGitHubTokensHeaders"
              :items="allGitHubTokens.edges"
              :hide-default-footer="true"
            >
              <template v-slot:[`item.node.user.avatarUrl`]="{ item }">
                <span>
                  <v-avatar size="24">
                    <img :src="item.node.user.avatarUrl" />
                  </v-avatar>
                </span>
              </template>
              <template v-slot:[`item.node.timeCreated`]="{ item }">
                <span>{{
                  new Date(item.node.timeCreated).toLocaleString()
                }}</span>
              </template></v-data-table
            >
          </template>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Orgnizations</v-card-title>
        <v-card-text>
          <git-hub-org-table></git-hub-org-table>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Users</v-card-title>
        <v-card-text>
          <template v-if="allGitHubUsers">
            <v-data-table
              :headers="allGitHubUsersHeaders"
              :items="allGitHubUsers.edges"
              :hide-default-footer="true"
            >
              <template v-slot:[`item.node.avatarUrl`]="{ item }">
                <span>
                  <v-avatar size="24">
                    <img :src="item.node.avatarUrl" />
                  </v-avatar>
                </span>
              </template>
            </v-data-table>
          </template>
        </v-card-text>
      </v-card>
    </v-card>
    <v-row align="center" justify="center">
      <pre>{{ allGitHubTokens }}</pre>
    </v-row>
  </v-container>
</template>

<script>
// import ALL_GITHUB_TOKENS from "@/graphql/admin-token/AllGitHubTokens.gql";
import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/admin-token/AllGitHubTokensWithOrgAccess.gql";
import ALL_GIT_HUB_USERS from "@/graphql/admin-token/AllGitHubUsers.gql";
import UPDATE_GITHUB_ORG_MEMBER_LIST from "@/graphql/admin-token/UpdateGitHubOrgMemberLists.gql";

import GitHubOrgTable from "@/components/admin-token/GitHubOrgTable";

export default {
  name: "Scratch",
  components: {
    GitHubOrgTable
  },
  data: () => ({
    allGitHubTokens: null,
    allGitHubTokensHeaders: [
      { text: "", value: "node.user.avatarUrl" },
      { text: "User", value: "node.user.login" },
      { text: "Token", value: "node.tokenMasked" },
      { text: "Scope", value: "node.scope" },
      { text: "Created at", value: "node.timeCreated" },
      { text: "", value: "actions", sortable: false },
    ],
    allGitHubUsers: null,
    allGitHubUsersHeaders: [
      { text: "", value: "node.avatarUrl" },
      { text: "User", value: "node.login" },
      { text: "Name", value: "node.name" },
    ],
  }),
  apollo: {
    allGitHubTokens: {
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    },
    allGitHubUsers: {
      query: ALL_GIT_HUB_USERS,
    },
  },
  methods: {
    async updateOrgMemberList() {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_GITHUB_ORG_MEMBER_LIST,
      });
    },
  },
};
</script>
