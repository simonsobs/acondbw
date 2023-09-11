<template>
  <v-navigation-drawer comment="fallthrough attributes in use">
    <v-progress-linear v-if="loading" indeterminate color="primary">
    </v-progress-linear>
    <v-list v-if="loaded" class="ma-2">
      <v-list-item
        v-for="node in nodes"
        :key="node.typeId"
        :to="{
          name: 'ProductList',
          params: { productTypeName: node.name },
        }"
        :prepend-icon="node.icon || undefined"
        color="primary"
        rounded="lg"
      >
        <v-list-item-title
          class="capitalize condensed-font"
          v-text="node.plural"
        >
        </v-list-item-title>
        <template v-slot:append>
          <v-chip
            small
            color="primary"
            v-if="node.products && node.products.totalCount"
            v-text="node.products.totalCount"
          >
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
    <div v-if="empty" class="mx-2 my-5 text-center">
      No product types are defined.
    </div>
    <div v-if="loaded || empty" class="px-5 py-0 text-right">
      <v-tooltip>
        <template v-slot:activator="{ props: tooltip }">
          <v-dialog persistent v-model="addDialog" max-width="800">
            <template v-slot:activator="{ props: addDialog }">
              <v-btn v-bind="{ ...tooltip, ...addDialog }" variant="text" icon>
                <v-icon size="x-small" icon="mdi-plus-thick"></v-icon>
              </v-btn>
            </template>
            <product-type-add-form
              v-if="addDialog"
              @cancel="onAddFormCancelled"
              @finished="onAddFormFinished"
            ></product-type-add-form>
          </v-dialog>
        </template>
        <span> Add a product type </span>
      </v-tooltip>
    </div>
    <v-alert
      v-if="error"
      variant="tonal"
      type="error"
      class="ma-2"
      :text="error"
    >
    </v-alert>
    <template v-slot:append>
      <div class="ma-4 d-flex justify-space-around align-center">
        <toggle-dark-mode-button></toggle-dark-mode-button>
        <span class="text-secondary text-body-2">v{{ appVersion }}</span>
      </div>
    </template>
    <dev-tool-loading-state-menu top="5px" right="5px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// https://vuetifyjs.com/en/components/navigation-drawers/

import { computed, ref } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

import ProductTypeAddForm from "@/components/product-type/ProductTypeAddForm.vue";
import ToggleDarkModeButton from "@/components/utils/ToggleDarkModeButton.vue";

import { useQueryState } from "@/utils/query-state";

const store = useStore();
const { appVersion } = store;

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

const queryState = useQueryState(query, { isEmpty });
const { loading, loaded, empty, error, devtoolState } = queryState;

const edges = computed(() => (empty.value ? [] : readEdges(query)));
const nodes = computed(() => (empty.value ? [] : readNodes(query)));

const addDialog = ref(false);

function onAddFormCancelled() {
  closeAddForm();
}

function onAddFormFinished() {
  closeAddForm();
}

function closeAddForm() {
  addDialog.value = false;
}
</script>
