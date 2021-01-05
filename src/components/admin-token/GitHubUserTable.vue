<template>
  <div>
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
  </div>
</template>

<script>
// The implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import ALL_GIT_HUB_USERS from "@/graphql/admin-token/AllGitHubUsers.gql";

export default {
  name: "GitHubUserTable",
  data: () => ({
    allGitHubUsers: null,
    allGitHubUsersHeaders: [
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "User", value: "node.login" },
      { text: "Name", value: "node.name" },
    ],
  }),
  apollo: {
    allGitHubUsers: {
      query: ALL_GIT_HUB_USERS,
    },
  },
};
</script>
