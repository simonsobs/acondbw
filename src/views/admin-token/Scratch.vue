<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card flat>
        <v-card>
          <v-card-title>Tokens with org access</v-card-title>
          <v-card-text>
            <git-hub-token-table></git-hub-token-table>
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
    </v-row>
  </v-container>
</template>

<script>
import GitHubTokenTable from "@/components/admin-token/GitHubTokenTable";
import GitHubOrgTable from "@/components/admin-token/GitHubOrgTable";
import GitHubUserTable from "@/components/admin-token/GitHubUserTable";

export default {
  name: "Scratch",
  components: {
    GitHubTokenTable,
    GitHubOrgTable,
    GitHubUserTable,
  },
  data: () => ({}),
};
</script>
