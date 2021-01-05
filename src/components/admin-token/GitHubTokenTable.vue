<template>
  <div>
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
          <span>{{ new Date(item.node.timeCreated).toLocaleString() }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="deleteToken(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/admin-token/AllGitHubTokensWithOrgAccess.gql";

export default {
  name: "GitHubTokenTable",
  data: () => ({
    allGitHubTokens: null,
    allGitHubTokensHeaders: [
      { text: "", value: "node.user.avatarUrl", align: "start" },
      { text: "User", value: "node.user.login" },
      { text: "Token", value: "node.tokenMasked" },
      { text: "Scope", value: "node.scope" },
      { text: "Created at", value: "node.timeCreated" },
      { text: "", value: "actions", sortable: false, align: "end" },
    ],
  }),
  apollo: {
    allGitHubTokens: {
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    },
  },
};
</script>
