<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Users</v-card-title>
          <v-card class="my-2">
            <v-card-title>Tokens with org access</v-card-title>
            <v-card-text>
              <git-hub-token-table></git-hub-token-table>
            </v-card-text>
          </v-card>
          <v-card class="my-2">
            <v-card-title>Organizations</v-card-title>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GitHubTokenTable from "@/components/admin/GitHubTokenTable.vue";
import GitHubOrgTable from "@/components/admin/GitHubOrgTable.vue";
import GitHubUserTable from "@/components/admin/GitHubUserTable.vue";

export default Vue.extend({
  name: "User",
  components: {
    GitHubTokenTable,
    GitHubOrgTable,
    GitHubUserTable,
  },
  data: () => ({}),
});
</script>
