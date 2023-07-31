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

<script lang="ts">
// The implementation based on the example
// https://vuetifyjs.com/en/components/data-tables/#crud-actions
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-data-table/misc-crud.vue

import { defineComponent, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { useQuery, useMutation, useClientHandle } from "@urql/vue";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth/oauth";

import ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS from "@/graphql/queries/AllGitHubTokensWithOrgAccess.gql";
import DELETE_GITHUB_TOKEN from "@/graphql/mutations/DeleteGitHubToken.gql";

interface GitHubUser {
  login: string;
  avatarUrl?: string;
  url?: string;
}

interface GitHubToken {
  tokenId: string;
  tokenMasked: string;
  scope: string;
  timeCreated: string;
  user: GitHubUser;
}

interface GitHubTokenEdge {
  node: GitHubToken;
}

interface GitHubTokenConnection {
  totalCount: number;
  edges: GitHubTokenEdge[];
}

export default defineComponent({
  name: "GitHubTokenTable",
  setup() {
    const router = useRouter();
    const store = useStore();
    const authStore = useAuthStore();
    const clientHandle = useClientHandle();
    const alert = ref(false);
    const error = ref<any>(null);

    const allGitHubTokens = ref<GitHubTokenConnection | null>(null);
    const query = useQuery<{ allGitHubTokens: GitHubTokenConnection }>({
      query: ALL_GIT_HUB_TOKENS_WITH_ORG_ACCESS,
    });
    watch(query.data, (data) => {
      if (data) {
        allGitHubTokens.value = data.allGitHubTokens;
      }
    });

    const allGitHubTokensHeaders = ref([
      { text: "", value: "node.user.avatarUrl", align: "start" },
      { text: "User", value: "node.user.login" },
      { text: "Token", value: "node.tokenMasked" },
      { text: "Scope", value: "node.scope" },
      { text: "Created at", value: "node.timeCreated" },
      { text: "", value: "actions", sortable: false, align: "end" },
    ]);

    const dialogAdd = ref(false);
    function closeAdd() {
      dialogAdd.value = false;
    }
    async function requestAuth() {
      try {
        authStore.clearAuthError();
        const callbackRoute = { name: "AdminAppAuth" };
        const scope = "read:org"; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        const rawState: UnencodedState = {
          redirect: callbackRoute,
          option: uuidv4(),
        };
        const state = encodeAndStoreState(rawState);
        await redirectToGitHubAuthURL(clientHandle.client, scope, state);
      } catch (error) {
        clearState();
        router.push({ name: "AdminAppTokenError" });
        closeAdd();
      }
    }

    const dialogDelete = ref(false);
    const deleteTokenId = ref<string | null>(null);
    function deleteToken(item) {
      if (!allGitHubTokens.value) return;
      const index = allGitHubTokens.value.edges.indexOf(item);
      deleteTokenId.value = allGitHubTokens.value.edges[index].node.tokenId;
      dialogDelete.value = true;
    }
    function closeDelete() {
      dialogDelete.value = false;
      nextTick(() => {
        deleteTokenId.value = null;
      });
    }
    const { executeMutation } = useMutation(DELETE_GITHUB_TOKEN);
    async function deleteItemConfirm() {
      try {
        const { error } = await executeMutation({
          tokenId: deleteTokenId.value,
        });
        if (error) throw error;
        query.executeQuery({ requestPolicy: "network-only" });
        store.apolloMutationCalled();
        store.setSnackbarMessage("Deleted");
      } catch (e) {
        error.value = e;
      }
      closeDelete();
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
      allGitHubTokens,
      allGitHubTokensHeaders,
      dialogAdd,
      closeAdd,
      requestAuth,
      dialogDelete,
      deleteTokenId,
      deleteToken,
      closeDelete,
      deleteItemConfirm,
    };
  },
});
</script>
