<template>
  <div class="mt-5" style="position: relative">
    <v-data-table
      :loading="loading"
      loading-text="Loading..."
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      @click:row="onClickRow"
    >
      <template v-slot:top>
        <div class="d-flex">
          <v-btn :disabled="loading" variant="text" icon @click="refresh">
            <v-icon icon="mdi-refresh"></v-icon>
          </v-btn>
          <v-btn variant="text" icon class="secondary">
            <v-icon icon="mdi-plus-thick"></v-icon>
          </v-btn>
        </div>
        <v-alert
          v-model="alert"
          variant="tonal"
          type="error"
          :text="error"
          v-if="error"
        >
        </v-alert>
      </template>
      <template v-slot:item.icon="{ item }">
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <template v-slot:item.name="{ item }">
        <span class="font-weight-bold text-primary"> {{ item.name }} </span>
      </template>
      <template v-slot:item.products="{ item }">
        <v-chip rounded>{{ item.products.totalCount }}</v-chip>
      </template>
      <template v-slot:item.actions>
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
      <template #bottom></template>
    </v-data-table>
    <dev-tool-loading-state-menu top="3px" right="3px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

import { useQueryState } from "@/utils/query-state";

const query = useAllProductTypesQuery();
type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allProductTypes?.edges;
  if (!edgesAndNulls) return [];
  return edgesAndNulls.flatMap((e) => (e ? [e] : []));
}

function readItems(query: Query) {
  return readEdges(query).flatMap((e) => (e.node ? e.node : []));
}

function isEmpty(query: Query) {
  return readItems(query).length === 0;
}

const edges = computed(() => (empty.value ? [] : readEdges(query)));
const items = computed(() => (empty.value ? [] : readItems(query)));

function onClickRow(item: (typeof items.value)[number]) {
  // console.log(item);
}

const headers = ref([
  { title: "Icon", key: "icon", sortable: false, width: "90px" },
  { title: "Name", key: "name", sortable: false },
  { title: "Singular", key: "singular", sortable: false },
  { title: "Plural", key: "plural", sortable: false },
  {
    title: "Count",
    key: "products",
    sortable: false,
    width: "90px",
    align: "center",
  },
  { title: "Actions", key: "actions", sortable: false, align: "end" },
]);

const queryState = useQueryState(query, { isEmpty });

const { loading, error, empty, refresh, devtoolState } = queryState;

const alert = ref(false);

watch(error, (val) => {
  alert.value = !!val;
});

watch(alert, (val) => {
  if (!val) error.value = null;
});
</script>
