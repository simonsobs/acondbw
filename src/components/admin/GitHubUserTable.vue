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

import { defineComponent, ref, watch } from "vue";
import { useStore } from "@/stores/main";
import { useQuery, useMutation } from "@urql/vue";

import ALL_GIT_HUB_USERS from "@/graphql/queries/AllGitHubUsers.gql";
import UPDATE_GITHUB_ORG_MEMBER_LIST from "@/graphql/mutations/UpdateGitHubOrgMemberLists.gql";

interface GitHubUser {
  login: string;
  avatarUrl?: string;
  url?: string;
}

interface GitHubUserEdge {
  node: GitHubUser;
}

interface GitHubUserConnection {
  totalCount: number;
  edges: GitHubUserEdge[];
}

export default defineComponent({
  name: "GitHubUserTable",
  setup() {
    const store = useStore();
    const alert = ref(false);
    const error = ref<any>(null);

    const allGitHubUsers = ref<GitHubUserConnection | null>(null);
    const query = useQuery<{ allGitHubUsers: GitHubUserConnection }>({
      query: ALL_GIT_HUB_USERS,
      variables: { orgMember: true },
    });
    watch(query.data, (data) => {
      if (data) {
        allGitHubUsers.value = data.allGitHubUsers;
      }
    });

    const allGitHubUsersHeaders = ref([
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "User", value: "node.login" },
      { text: "Name", value: "node.name" },
    ]);

    const { executeMutation } = useMutation(UPDATE_GITHUB_ORG_MEMBER_LIST);
    async function updateOrgMemberList() {
      try {
        const { error } = await executeMutation({});
        query.executeQuery({ requestPolicy: "network-only" });
        store.apolloMutationCalled();
        store.setSnackbarMessage("Updated");
      } catch (e) {
        error.value = e;
      }
    }

    watch(error, (val, oldVal) => {
      alert.value = val ? true : false;
    });

    watch(alert, (val, oldVal) => {
      if (!val) {
        error.value = null;
      }
    });

    return {
      alert,
      error,
      allGitHubUsers,
      allGitHubUsersHeaders,
      updateOrgMemberList,
    };
  },
});
</script>
