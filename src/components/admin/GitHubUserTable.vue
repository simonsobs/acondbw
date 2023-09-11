<template>
  <div class="mt-5" style="position: relative">
    <template v-if="nodes">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :items-per-page="20"
        :hide-default-footer="true"
      >
        <template v-slot:top>
          <v-alert v-if="error" variant="tonal" type="error" :text="error">
          </v-alert>
          <v-alert
            closable
            v-model="alertMutation"
            variant="tonal"
            type="error"
            :text="errorMutation"
          >
          </v-alert>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn variant="text" icon @click="updateOrgMemberList">
              <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:item.avatarUrl="{ item }">
          <span>
            <v-avatar size="24">
            <v-img :src="item.raw.avatarUrl"></v-img>
            </v-avatar>
          </span>
        </template>
      </v-data-table>
    </template>
    <dev-tool-loading-state-menu top="3px" right="3px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import {
  useAllGitHubUsersQuery,
  useUpdateGitHubOrgMemberListsMutation,
} from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

const store = useStore();

const query = useAllGitHubUsersQuery();
type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allGitHubUsers?.edges;
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
    avatarUrl: node.avatarUrl,
    login: node.login,
    name: node.name,
  }))
);

const headers = ref([
  { title: "", key: "avatarUrl", align: "start" },
  { title: "User", key: "login" },
  { title: "Name", key: "name" },
]);

const alertMutation = ref(false);
const errorMutation = ref<any>(null);

const { executeMutation } = useUpdateGitHubOrgMemberListsMutation();
async function updateOrgMemberList() {
  try {
    const { error } = await executeMutation({});
    if (error) throw error;
    query.executeQuery({ requestPolicy: "network-only" });
    store.apolloMutationCalled();
    store.setSnackbarMessage("Updated");
  } catch (e) {
    // @ts-ignore
    errorMutation.value = e.message;
  }
}

watch(errorMutation, (val, oldVal) => {
  alertMutation.value = val ? true : false;
});

watch(alertMutation, (val, oldVal) => {
  if (!val) errorMutation.value = null;
});
</script>
