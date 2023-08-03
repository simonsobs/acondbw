<template>
  <v-navigation-drawer v-model="drawer">
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
    <v-card-text v-if="empty" outlined dense type="info" class="ma-2">
      No product types are defined.
    </v-card-text>
    <v-card-actions v-if="loaded || empty" class="px-5 py-0">
      <v-spacer></v-spacer>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ props: tooltip }">
          <v-dialog persistent v-model="addDialog" max-width="800">
            <template v-slot:activator="{ props: addDialog }">
              <v-btn icon v-bind="{ ...tooltip, ...addDialog }">
                <v-icon x-small>mdi-plus-thick</v-icon>
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
    </v-card-actions>
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="18"
      :width="3"
      color="secondary"
      class="mx-5 mt-5"
    >
    </v-progress-circular>
    <v-alert v-if="error" variant="tonal" dense type="error" class="ma-2">
      {{ error }}
    </v-alert>
    <template v-slot:append>
      <v-list>
        <v-list-item :title="`v${appVersion}`" disabled> </v-list-item>
      </v-list>
    </template>
    <dev-tool-loading-state-menu top="5px" right="5px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// https://vuetifyjs.com/en/components/navigation-drawers/

import { computed, ref, watch, watchEffect } from "vue";
import { useStore } from "@/stores/main";

import { useAllProductTypesQuery } from "@/generated/graphql";

import ProductTypeAddForm from "@/components/product-type/ProductTypeAddForm.vue";

import { useQueryState } from "@/utils/query-state";

interface Props {
  modelValue?: boolean;
}
interface Emits {
  (event: "update:modelValue", value: boolean): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const drawer = ref(props.modelValue);
watchEffect(() => {
  drawer.value = props.modelValue;
});
watch(drawer, (val) => {
  emit("update:modelValue", val);
});

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
