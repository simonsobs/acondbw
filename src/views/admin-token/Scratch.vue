<template>
  <v-container fill-height fluid>
    <v-card flat>
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
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="deleteToken(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
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
          <git-hub-user-table></git-hub-user-table>
        </v-card-text>
      </v-card>
    </v-card>
    <v-row align="center" justify="center">
      <pre>{{ allGitHubTokens }}</pre>
    </v-row>
  </v-container>
</template>

<script>
import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/admin-token/AllGitHubTokensWithOrgAccess.gql";

import GitHubOrgTable from "@/components/admin-token/GitHubOrgTable";
import GitHubUserTable from "@/components/admin-token/GitHubUserTable";

export default {
  name: "Scratch",
  components: {
    GitHubOrgTable,
    GitHubUserTable,
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
  }),
  apollo: {
    allGitHubTokens: {
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    },
  },
};
</script>
