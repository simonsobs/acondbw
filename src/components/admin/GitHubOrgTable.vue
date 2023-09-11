<template>
  <div class="mt-5" style="position: relative">
    <template v-if="items">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :items-per-page="-1"
      >
        <template v-slot:top>
          <v-alert v-if="error" variant="tonal" type="error" :text="error">
          </v-alert>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialogAdd" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="text" icon>
                  <v-icon icon="mdi-plus-thick"></v-icon>
                </v-btn>
              </template>
              <git-hub-org-add-form
                @cancel="addFormCanceled"
                @finished="addFormFinished"
              >
              </git-hub-org-add-form>
            </v-dialog>
            <v-dialog v-model="dialogRemove" max-width="500px">
              <git-hub-org-remove-form
                :login="removeLogin"
                @cancel="removeFormCanceled"
                @finished="removeFormFinished"
                v-if="removeLogin"
              >
              </git-hub-org-remove-form>
            </v-dialog>
          </div>
        </template>
        <template v-slot:item.avatarUrl="{ item }">
          <v-avatar size="24">
            <v-img :src="item.raw.avatarUrl"></v-img>
          </v-avatar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="openRemoveForm(item.raw)" icon="mdi-delete">
          </v-icon>
        </template>
      </v-data-table>
    </template>
    <dev-tool-loading-state-menu top="3px" right="3px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { useAllGitHubOrgsQuery } from "@/graphql/codegen/generated";
import { useQueryState } from "@/utils/query-state";

import GitHubOrgAddForm from "./GitHubOrgAddForm.vue";
import GitHubOrgRemoveForm from "./GitHubOrgRemoveForm.vue";
import { i } from "vitest/dist/index-6e18a03a";

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

const allGitHubOrgs = ref<GitHubOrgConnection | null>(null);
// const query = useQuery<{ allGitHubOrgs: GitHubOrgConnection }>({
//   query: ALL_GIT_HUB_ORGS,
// });
// watch(query.data, (data) => {
//   if (data) {
//     allGitHubOrgs.value = data.allGitHubOrgs;
//   }
// });

const query = useAllGitHubOrgsQuery();
type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allGitHubOrgs?.edges;
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
    totalCount: node.memberships?.totalCount ?? 0,
  }))
);

const headers = ref([
  { title: "", key: "avatarUrl", align: "start" },
  { title: "Org", key: "login" },
  { title: "Number of members", key: "totalCount", align: "end" },
  { title: "", key: "actions", sortable: false, align: "end" },
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
function openRemoveForm(item: (typeof items.value)[0]) {
  removeLogin.value = item.login;
  dialogRemove.value = true;
}
</script>
