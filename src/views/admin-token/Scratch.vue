<template>
  <v-container fill-height fluid>
    <v-card flat>
      <v-card-actions>
        <v-btn block outlined @click="updateOrgMemberList">
          <v-icon left>mdi-github</v-icon>Update org member list
        </v-btn>
      </v-card-actions>
      <template v-if="allGitHubTokensData">
        <v-data-table
          :headers="allGitHubTokensHeaders"
          :items="allGitHubTokensData"
        >
          <template v-slot:[`item.timeCreated`]="{ item }">
            <span>{{ new Date(item.timeCreated).toLocaleString() }}</span>
          </template></v-data-table
        >
        <pre>{{ allGitHubTokensData }}</pre>
      </template>
    </v-card>
    <v-row align="center" justify="center">
      <pre>{{ allGitHubTokens }}</pre>
    </v-row>
  </v-container>
</template>

<script>
// import ALL_GITHUB_TOKENS from "@/graphql/admin-token/AllGitHubTokens.gql";
import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/admin-token/AllGitHubTokensWithOrgAccess.gql";
import UPDATE_GITHUB_ORG_MEMBER_LIST from "@/graphql/admin-token/UpdateGitHubOrgMemberLists.gql";

export default {
  name: "Scratch",
  data: () => ({
    allGitHubTokens: null,
    allGitHubTokensHeaders: [
      { text: "User", value: "user.login" },
      { text: "Token", value: "tokenMasked" },
      { text: "Scope", value: "scope" },
      { text: "Created at", value: "timeCreated" },
    ],
  }),
  apollo: {
    allGitHubTokens: {
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    },
  },
  computed: {
    allGitHubTokensData: function () {
      if (!(this.allGitHubTokens && this.allGitHubTokens.edges)) {
        return null;
      } else {
        const edges = this.allGitHubTokens.edges;
        return edges.map((e) => e.node);
      }
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
