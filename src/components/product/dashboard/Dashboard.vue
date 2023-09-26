<template>
  <div class="dashboard px-5">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="-1"
      @click:row="clickRow"
    >
      <template v-slot:top>
        <v-alert v-if="error" variant="tonal" type="error" :text="error">
        </v-alert>
        <refresh-button :disabled="loading" @refresh="refresh">
        </refresh-button>
      </template>
      <template v-slot:[`item.plural`]="{ item }">
        <router-link
          :to="{
            name: 'ProductList',
            params: { productTypeName: item.raw.name },
          }"
          class="text-capitalize font-weight-bold text-primary text-decoration-none"
          v-text="item.raw.plural"
        >
        </router-link>
      </template>
      <template #bottom></template>
    </v-data-table>
    <dev-tool-loading-state-menu
      top="-30px"
      right="10px"
      v-model="devtoolState"
    >
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

import { useQueryState } from "@/utils/query-state";

import RefreshButton from "./RefreshButton.vue";

const router = useRouter();

const query = useAllProductTypesQuery();
type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allProductTypes?.edges;
  if (!edgesAndNulls) return [];
  return edgesAndNulls.flatMap((e) => (e ? [e] : []));
}

function readNodes(query: Query) {
  return readEdges(query).flatMap((e) => (e.node ? e.node : []));
}

function isEmpty(query: Query) {
  return readNodes(query).length === 0;
}

const headers = ref([
  { title: "Product type", key: "plural" },
  {
    title: "Number of products",
    align: "end" as const,
    key: "products.totalCount",
  },
]);

const queryState = useQueryState(query, { isEmpty });
const { loading, loaded, empty, error, refresh, devtoolState } = queryState;

const items = computed(() => (empty.value ? [] : readNodes(query)));

function clickRow(event: Event, { item }) {
  router.push({
    name: "ProductList",
    params: { productTypeName: item.selectable.name },
  });
}
</script>

<style scoped>
.dashboard {
  position: relative;
}

/* :deep() selects child components in scoped styles */
.dashboard:deep(tbody tr :hover) {
  cursor: pointer;
}
</style>
