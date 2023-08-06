<template>
  <div class="dashboard px-5">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="-1"
      @click:row="clickRow"
      class="elevation-1"
    >
      <template v-slot:[`item.plural`]="{ item }">
        <router-link
          :to="{
            name: 'ProductList',
            params: { productTypeName: item.selectable.name },
          }"
        >
          <span class="capitalize font-weight-bold text-primary">
            {{ item.selectable.plural }}
          </span>
        </router-link>
      </template>
      <template #bottom></template>
    </v-data-table>
    <v-alert
      v-if="error"
      variant="tonal"
      type="error"
      :text="error"
      style="width: 100%"
    >
    </v-alert>
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

import { useAllProductTypesQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

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
    align: "end",
    key: "products.totalCount",
  },
]);

const queryState = useQueryState(query, { isEmpty });
const { loading, loaded, empty, error, devtoolState } = queryState;

const items = computed(() => (empty.value ? [] : readNodes(query)));

function clickRow(event: Event, { item }) {
  router.push({
    name: "ProductList",
    params: { productTypeName: item.selectable.name },
  });
}
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.dashboard {
  position: relative;
}

/* :deep() selects child components in scoped styles */
.dashboard:deep(.v-table) {
  background: rgb(var(--v-theme-surface-container-lowest));
}
.dashboard:deep(.v-table-table),
.dashboard:deep(.v-table__wrapper > table > thead > tr th),
.dashboard:deep(.v-table__wrapper > table tbody > tr > td) {
  background-color: inherit;
}
.dashboard:deep(tbody tr :hover) {
  cursor: pointer;
}
</style>
