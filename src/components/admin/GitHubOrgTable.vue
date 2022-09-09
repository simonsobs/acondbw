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
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="openRemoveForm(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
  setup() {},
  data: () => ({
    allGitHubOrgs: null as GitHubOrgConnection | null,
    allGitHubOrgsHeaders: [
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "Org", value: "node.login" },
      { text: "Number of members", value: "node.memberships.totalCount" },
      { text: "", value: "actions", sortable: false, align: "end" },
    ],
    dialogAdd: false,
    dialogRemove: false,
    removeLogin: null as string | null,
    alert: false,
    error: null,
  }),
  apollo: {
    allGitHubOrgs: {
      query: ALL_GIT_HUB_ORGS,
    },
  },
  methods: {
    addFormCanceled() {
      this.closeAddDialog();
    },
    addFormFinished() {
      this.$apollo.queries.allGitHubOrgs.refetch();
      this.closeAddDialog();
    },
    closeAddDialog() {
      this.dialogAdd = false;
    },
    removeFormCanceled() {
      this.closeRemoveForm();
    },
    removeFormFinished() {
      this.$apollo.queries.allGitHubOrgs.refetch();
      this.closeRemoveForm();
    },
    closeRemoveForm() {
      this.dialogRemove = false;
      this.$nextTick(() => {
        this.removeLogin = null;
      });
    },
    openRemoveForm(item) {
      if (!this.allGitHubOrgs) return;
      const index = this.allGitHubOrgs.edges.indexOf(item);
      this.removeLogin = this.allGitHubOrgs.edges[index].node.login;
      this.dialogRemove = true;
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
