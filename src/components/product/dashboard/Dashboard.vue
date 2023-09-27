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
        <v-alert v-if="error" variant="tonal" type="error">
          {{ error }}
        </v-alert>
        <refresh-button :disabled="loading" @refresh="refresh">
        </refresh-button>
      </template>
      <template v-slot:[`item.plural`]="{ item }">
        <router-link
          :to="item.raw.to"
          class="text-capitalize font-weight-bold text-primary text-decoration-none"
          v-text="item.raw.plural"
        >
        </router-link>
      </template>
      <template #bottom></template>
    </v-data-table>
    <dev-tool-checkboxes top="-30px" right="10px" v-model="override">
    </dev-tool-checkboxes>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

import RefreshButton from "./RefreshButton.vue";

import { useQueryResponse, useConnection } from "./query";
import { useOverride } from "./override";
import { useRefreshOnMutation } from "./refresh";

const queryResponse = useAllProductTypesQuery();
const connection = computed(() => queryResponse.data?.value?.allProductTypes);

const query = {
  ...useQueryResponse(queryResponse),
  ...useConnection(connection),
};

const { override, loading, error, nodes } = useOverride(query);

const refresh = query.refresh;
useRefreshOnMutation(refresh);

const headers = ref([
  { title: "Product type", key: "plural" },
  {
    title: "Number of products",
    align: "end" as const,
    key: "nProducts",
  },
]);

const items = computed(() =>
  nodes.value.map((node) => ({
    name: node.name,
    plural: node.plural,
    nProducts: node.products?.totalCount || 0,
    to: {
      name: "ProductList",
      params: { productTypeName: node.name },
    },
  }))
);

const router = useRouter();

function clickRow(event: Event, { item }) {
  router.push(item.raw.to);
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
