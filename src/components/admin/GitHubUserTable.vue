<template>
  <div>
    <template v-if="allGitHubUsers">
      <v-data-table
        :headers="allGitHubUsersHeaders"
        :items="allGitHubUsers.edges"
        :items-per-page="allGitHubUsers.totalCount"
        :hide-default-footer="true"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn icon @click="updateOrgMemberList">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-alert dismissible v-model="alert" type="error">{{
            error
          }}</v-alert>
        </template>
        <template v-slot:[`item.node.avatarUrl`]="{ item }">
          <span>
            <v-avatar size="24">
              <img :src="item.node.avatarUrl" />
            </v-avatar>
          </span>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
// The implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import Vue from "vue";
import ALL_GIT_HUB_USERS from "@/graphql/queries/AllGitHubUsers.gql";
import UPDATE_GITHUB_ORG_MEMBER_LIST from "@/graphql/mutations/UpdateGitHubOrgMemberLists.gql";

export default Vue.extend({
  name: "GitHubUserTable",
  data: () => ({
    allGitHubUsers: null,
    allGitHubUsersHeaders: [
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "User", value: "node.login" },
      { text: "Name", value: "node.name" },
    ],
    alert: false,
    error: null as any,
  }),
  apollo: {
    allGitHubUsers: {
      query: ALL_GIT_HUB_USERS,
      variables: { orgMember: true },
    },
  },
  methods: {
    async updateOrgMemberList() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPDATE_GITHUB_ORG_MEMBER_LIST,
        });
        this.$apollo.queries.allGitHubUsers.refetch();
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Updated");
      } catch (error) {
        this.error = error;
      }
    },
  },
  watch: {
    error: function (val, oldVal) {
      this.alert = val ? true : false;
    },
    alert: function (val, oldVal) {
      if (!val) {
        this.error = null;
      }
    },
  },
});
</script>
