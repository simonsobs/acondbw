<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card flat>
        <div class="text-h4">Settings</div>
        <v-card class="my-2">
          <v-card-title>Tokens with org access</v-card-title>
          <v-card-text>
            <git-hub-token-table></git-hub-token-table>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-title>Orgnizations</v-card-title>
          <v-card-text>
            <git-hub-org-table></git-hub-org-table>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-title>Organization members</v-card-title>
          <v-card-text>
            <git-hub-user-table></git-hub-user-table>
          </v-card-text>
        </v-card>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import GitHubTokenTable from "@/components/admin/GitHubTokenTable";
import GitHubOrgTable from "@/components/admin/GitHubOrgTable";
import GitHubUserTable from "@/components/admin/GitHubUserTable";

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
