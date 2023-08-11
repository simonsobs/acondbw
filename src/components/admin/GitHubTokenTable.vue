<template>
  <div class="mt-5" style="position: relative">
    <template v-if="nodes">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :items-per-page="-1"
        :hide-default-footer="true"
      >
        <template v-slot:top>
          <v-alert v-if="error" variant="tonal" type="error" :text="error">
          </v-alert>
          <v-alert
            closable
            v-model="alertDelete"
            variant="tonal"
            type="error"
            :text="errorDelete"
          >
          </v-alert>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialogAdd" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="text" icon>
                  <v-icon icon="mdi-plus-thick"></v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>Add a token with org access</v-card-title>
                <v-card-actions>
                  <v-btn block variant="outlined" @click="requestAuth">
                    <v-icon icon="mdi-github"></v-icon>
                    Add
                  </v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" variant="text" @click="closeAdd">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card class="pa-2">
                <v-card-title class="headline">Delete</v-card-title>
                <v-card-text class="body-1 font-weight-medium text-error">
                  Really, delete the token?
                </v-card-text>
                <v-card-actions>
                  <v-btn color="secondary" @click="closeDelete"> Cancel </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="deleteItemConfirm"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <template v-slot:item.avatarUrl="{ item }">
          <v-avatar size="24">
            <v-img :src="item.raw.avatarUrl"></v-img>
          </v-avatar>
        </template>
        <template v-slot:item.timeCreated="{ item }">
          <span>{{ new Date(item.raw.timeCreated).toLocaleString() }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteToken(item.raw)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
    <dev-tool-loading-state-menu top="3px" right="3px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { useClientHandle } from "@urql/vue";

import {
  useAllGitHubTokensWithOrgAccessQuery,
  useDeleteGitHubTokenMutation,
} from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth/oauth";

const router = useRouter();
const store = useStore();
const authStore = useAuthStore();
const clientHandle = useClientHandle();

const query = useAllGitHubTokensWithOrgAccessQuery();
type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allGitHubTokens?.edges;
  if (!edgesAndNulls) return [];
  return edgesAndNulls.flatMap((e) => (e ? [e] : []));
}

function readNodes(query: Query) {
  return readEdges(query).flatMap((e) => (e.node ? e.node : []));
}

function isEmpty(query: Query) {
  return readNodes(query).length === 0;
}

const queryState = useQueryState(query, { isEmpty });
const { loading, loaded, empty, error, devtoolState } = queryState;

const edges = computed(() => (empty.value ? [] : readEdges(query)));
const nodes = computed(() => (empty.value ? [] : readNodes(query)));

const items = computed(() =>
  nodes.value.map((node) => ({
    avatarUrl: node.user?.avatarUrl,
    login: node.user?.login,
    tokenMasked: node.tokenMasked,
    scope: node.scope,
    timeCreated: node.timeCreated,
    tokenId: Number(node.tokenId),
  }))
);

const headers = ref([
  { title: "", key: "avatarUrl", align: "start" },
  { title: "User", key: "login" },
  { title: "Token", key: "tokenMasked" },
  { title: "Scope", key: "scope" },
  { title: "Created at", key: "timeCreated" },
  { title: "", key: "actions", sortable: false, align: "end" },
]);

const alertDelete = ref(false);
const errorDelete = ref<any>(null);

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
const deleteTokenId = ref<number | null>(null);
function deleteToken(item: (typeof items.value)[0]) {
  deleteTokenId.value = item.tokenId;
  dialogDelete.value = true;
}
function closeDelete() {
  dialogDelete.value = false;
  nextTick(() => {
    deleteTokenId.value = null;
  });
}
const { executeMutation } = useDeleteGitHubTokenMutation();
async function deleteItemConfirm() {
  if (!deleteTokenId.value) return;
  try {
    const { error } = await executeMutation({
      tokenId: deleteTokenId.value,
    });
    if (error) throw error;
    query.executeQuery({ requestPolicy: "network-only" });
    store.apolloMutationCalled();
    store.setSnackbarMessage("Deleted");
  } catch (e) {
    // @ts-ignore
    errorDelete.value = e.message;
  }
  closeDelete();
}

watch(errorDelete, (val, oldVal) => {
  alertDelete.value = val ? true : false;
});

watch(alertDelete, (val, oldVal) => {
  if (!val) errorDelete.value = null;
});
</script>
