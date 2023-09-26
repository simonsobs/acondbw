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

import { useQueryState } from "./query-state";
import RefreshButton from "./RefreshButton.vue";

const router = useRouter();

const query = useAllProductTypesQuery();

const connection = computed(() => query.data?.value?.allProductTypes);

const edges = computed(
  () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
);

const nodes = computed(() => edges.value.flatMap((e) => e.node || []));

const isNull = computed(() => connection.value === null);
const isEmpty = computed(() => nodes.value.length === 0);

const headers = ref([
  { title: "Product type", key: "plural" },
  {
    title: "Number of products",
    align: "end" as const,
    key: "nProducts",
  },
]);

const queryState = useQueryState(query, { isNull, isEmpty });
const { loading, loaded, empty, error, refresh, devtoolState } = queryState;

const items = computed(() =>
  empty.value
    ? []
    : nodes.value.map((node) => ({
        name: node.name,
        plural: node.plural,
        nProducts: node.products?.totalCount || 0,
      }))
);

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
