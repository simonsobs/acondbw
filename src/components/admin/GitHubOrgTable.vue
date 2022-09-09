<template>
  <div>
    <template v-if="allGitHubOrgs">
      <v-data-table
        :headers="allGitHubOrgsHeaders"
        :items="allGitHubOrgs.edges"
        :items-per-page="allGitHubOrgs.totalCount"
        :hide-default-footer="true"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialogAdd" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
              </template>
              <git-hub-org-add-form
                @cancel="addFormCanceled"
                @finished="addFormFinished"
              ></git-hub-org-add-form>
            </v-dialog>
            <v-dialog v-model="dialogRemove" max-width="500px">
              <git-hub-org-remove-form
                :login="removeLogin"
                @cancel="removeFormCanceled"
                @finished="removeFormFinished"
              ></git-hub-org-remove-form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.node.avatarUrl`]="{ item }">
          <span>
            <v-avatar size="24">
              <img :src="item.node.avatarUrl" />
            </v-avatar>
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="openRemoveForm(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import { useQuery } from "@urql/vue";
// The original implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import ALL_GIT_HUB_ORGS from "@/graphql/queries/AllGitHubOrgs.gql";

import GitHubOrgAddForm from "./GitHubOrgAddForm.vue";
import GitHubOrgRemoveForm from "./GitHubOrgRemoveForm.vue";

interface GitHubUser {
  login: string;
}

interface GitHubOrgMembership {
  member: GitHubUser;
}

interface GitHubOrgMembershipEdge {
  node: GitHubOrgMembership;
}

interface GitHubOrgMembershipConnection {
  totalCount: number;
  edges: GitHubOrgMembershipEdge[];
}

interface GitHubOrg {
  login: string;
  avatarUrl?: string;
  url?: string;
  members: GitHubOrgMembershipConnection;
}

interface GitHubOrgEdge {
  node: GitHubOrg;
}

interface GitHubOrgConnection {
  totalCount: number;
  edges: GitHubOrgEdge[];
}

export default defineComponent({
  name: "GitHubOrgTable",
  components: {
    GitHubOrgAddForm,
    GitHubOrgRemoveForm,
  },
  setup() {
    const allGitHubOrgs = ref<GitHubOrgConnection | null>(null);
    const query = useQuery<{ allGitHubOrgs: GitHubOrgConnection }>({
      query: ALL_GIT_HUB_ORGS,
    });
    watch(query.data, (data) => {
      if (data) {
        allGitHubOrgs.value = data.allGitHubOrgs;
      }
    });

    const allGitHubOrgsHeaders = ref([
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "Org", value: "node.login" },
      { text: "Number of members", value: "node.memberships.totalCount" },
      { text: "", value: "actions", sortable: false, align: "end" },
    ]);

    const dialogAdd = ref(false);
    function addFormCanceled() {
      closeAddDialog();
    }
    function addFormFinished() {
      query.executeQuery({ requestPolicy: "network-only" });
      closeAddDialog();
    }
    function closeAddDialog() {
      dialogAdd.value = false;
    }

    const dialogRemove = ref(false);
    const removeLogin = ref<string | null>(null);
    function removeFormCanceled() {
      closeRemoveForm();
    }
    function removeFormFinished() {
      query.executeQuery({ requestPolicy: "network-only" });
      closeRemoveForm();
    }
    function closeRemoveForm() {
      dialogRemove.value = false;
      nextTick(() => {
        removeLogin.value = null;
      });
    }
    function openRemoveForm(item) {
      if (!allGitHubOrgs.value) return;
      const index = allGitHubOrgs.value.edges.indexOf(item);
      removeLogin.value = allGitHubOrgs.value.edges[index].node.login;
      dialogRemove.value = true;
    }

    return {
      allGitHubOrgs,
      allGitHubOrgsHeaders,
      dialogAdd,
      addFormCanceled,
      addFormFinished,
      closeAddDialog,
      dialogRemove,
      removeLogin,
      removeFormCanceled,
      removeFormFinished,
      closeRemoveForm,
      openRemoveForm,
    };
  },
});
</script>
