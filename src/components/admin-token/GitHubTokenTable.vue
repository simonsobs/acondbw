<template>
  <div>
    <template v-if="allGitHubTokens">
      <v-data-table
        :headers="allGitHubTokensHeaders"
        :items="allGitHubTokens.edges"
        :items-per-page="allGitHubTokens.totalCount"
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
                <v-card-title>Add a token with org access</v-card-title>
                <v-card-actions>
                  <v-btn block outlined @click="requestAuth">
                    <v-icon left>mdi-github</v-icon>Add
                  </v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="closeAdd">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Delete</v-card-title>
                <v-card-text class="body-1 font-weight-medium error--text"
                  >Really, delete the token?</v-card-text
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
        <template v-slot:[`item.node.user.avatarUrl`]="{ item }">
          <span>
            <v-avatar size="24">
              <img :src="item.node.user.avatarUrl" />
            </v-avatar>
          </span>
        </template>
        <template v-slot:[`item.node.timeCreated`]="{ item }">
          <span>{{ new Date(item.node.timeCreated).toLocaleString() }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="deleteToken(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
// The implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import { redirectToGitHubAuthURL } from "@/utils/auth.js";
import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/admin-token/AllGitHubTokensWithOrgAccess.gql";
import DELETE_GITHUB_TOKEN from "@/graphql/admin-token/DeleteGitHubToken.gql";

export default {
  name: "GitHubTokenTable",
  data: () => ({
    allGitHubTokens: null,
    allGitHubTokensHeaders: [
      { text: "", value: "node.user.avatarUrl", align: "start" },
      { text: "User", value: "node.user.login" },
      { text: "Token", value: "node.tokenMasked" },
      { text: "Scope", value: "node.scope" },
      { text: "Created at", value: "node.timeCreated" },
      { text: "", value: "actions", sortable: false, align: "end" },
    ],
    dialogAdd: false,
    dialogDelete: false,
    deleteTokenId: null,
    alert: false,
    error: null,
  }),
  apollo: {
    allGitHubTokens: {
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    },
  },
  methods: {
    closeAdd() {
      this.dialogAdd = false;
    },
    async requestAuth() {
      this.loading = true;
      try {
        this.$store.dispatch("clearAuthError");
        const callbackRoute = { name: "AdminAppAuth" };
        const scope = "read:org"; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        await redirectToGitHubAuthURL(
          window,
          this.$apollo,
          callbackRoute,
          scope
        );
      } catch (error) {
        this.$router.push({ name: "AdminAppTokenError" });
        this.closeAdd();
      }
    },
    deleteToken(item) {
      const index = this.allGitHubTokens.edges.indexOf(item);
      this.deleteTokenId = this.allGitHubTokens.edges[index].node.tokenId;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_GITHUB_TOKEN,
          variables: { tokenId: this.deleteTokenId },
        });
        this.$apollo.queries.allGitHubTokens.refetch();
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Deleted");
      } catch (error) {
        this.error = error;
      }
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.deleteTokenId = null;
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
    }
  }
};
</script>
