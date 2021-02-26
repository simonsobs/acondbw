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
              <v-card>
                <v-card-title>Add a GitHub organization</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="addLogin"
                          label="GitHub organization account name"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="closeAdd"
                    >Cancel</v-btn
                  >
                  <v-btn color="primary" text @click="addItem"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Remove</v-card-title>
                <v-card-text class="body-1 font-weight-medium error--text"
                  >Really, remove "{{ deleteLogin }}" ?</v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="error" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
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
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
// The implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import ALL_GIT_HUB_ORGS from "@/graphql/queries/AllGitHubOrgs.gql";
import DELETE_GITHUB_ORG from "@/graphql/mutations/DeleteGitHubOrg.gql";
import ADD_GITHUB_ORG from "@/graphql/mutations/AddGitHubOrg.gql";

export default {
  name: "GitHubOrgTable",
  data: () => ({
    allGitHubOrgs: null,
    allGitHubOrgsHeaders: [
      { text: "", value: "node.avatarUrl", align: "start" },
      { text: "Org", value: "node.login" },
      { text: "Number of members", value: "node.memberships.totalCount" },
      { text: "", value: "actions", sortable: false, align: "end"},
    ],
    dialogAdd: false,
    addLogin: "",
    dialogDelete: false,
    deleteLogin: null,
    alert: false,
    error: null,
  }),
  apollo: {
    allGitHubOrgs: {
      query: ALL_GIT_HUB_ORGS,
    },
  },
  methods: {
    closeAdd() {
      this.dialogAdd = false;
      this.addLogin = "";
    },
    async addItem() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADD_GITHUB_ORG,
          variables: { login: this.addLogin },
        });
        this.$apollo.queries.allGitHubOrgs.refetch();
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Added");
      } catch (error) {
        this.error = error;
      }
      this.closeAdd();
    },
    deleteItem(item) {
      const index = this.allGitHubOrgs.edges.indexOf(item);
      this.deleteLogin = this.allGitHubOrgs.edges[index].node.login;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_GITHUB_ORG,
          variables: { login: this.deleteLogin },
        });
        this.$apollo.queries.allGitHubOrgs.refetch();
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Removed");
      } catch (error) {
        this.error = error;
      }
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.deleteLogin = null;
      });
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
};
</script>
