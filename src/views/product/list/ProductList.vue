<template>
  <div class="my-5" style="block-size: 100%; position: relative">
    <div v-if="error">
      <v-alert variant="tonal" type="error" :text="error"> </v-alert>
    </div>
    <top-bar
      :loading="loading"
      :loaded="loaded"
      :product-type="productType"
      v-model:sort="sort"
      v-model:are-all-cards-collapsed="areAllCardsCollapsed"
      @refresh="refresh()"
    >
    </top-bar>
    <div>
      <div v-if="nodes.length" class="pt-0 pb-16">
        <list
          :loading="loading"
          :product-type="productType"
          :edges="edges"
          :nodes="nodes"
          :n-items-total="nItemsTotal"
          :n-items-initial-load="nItemsInitialLoad"
          v-model:first="first"
          :is-card-collapsed="isCardCollapsed"
          v-if="!empty && productType"
        >
        </list>
      </div>
      <div v-else-if="loading">
        <div class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-else-if="empty">
        <empty :product-type="productType" v-if="productType"></empty>
      </div>
    </div>
    <v-btn
      :disabled="disableAdd"
      icon
      variant="flat"
      size="x-large"
      color="tertiary-container"
      elevation="8"
      :to="{
        name: 'ProductAdd',
        params: { productTypeName: productType.name },
      }"
      v-if="loaded && !empty && productType"
      style="position: fixed; bottom: 24px; right: 24px"
    >
      <v-icon icon="mdi-plus-thick"></v-icon>
    </v-btn>
    <dev-tool-loading-state-menu top="0" right="-35px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";
import { useConfigStore } from "@/plugins/pinia/stores/config";

import TopBar from "./TopBar.vue";
import List from "./List.vue";
import Empty from "./Empty.vue";

import {
  useQueryForProductListQuery,
  ProductSortEnum,
} from "@/graphql/codegen/generated";

import { useQueryState } from "@/utils/query-state";

interface Props {
  productTypeId: number;
}

const props = defineProps<Props>();

const configStore = useConfigStore();
const disableAdd = computed(() => !configStore.config.productCreationDialog);

const nItemsInitialLoad = ref(10);
const first = ref(nItemsInitialLoad.value);

const sort = ref<ProductSortEnum[]>([]);

const query = useQueryForProductListQuery({
  variables: {
    typeId: props.productTypeId,
    // @ts-ignore
    sort: sort,
    // @ts-ignore
    first: first,
    after: "",
  },
});

type Query = typeof query;

const productType = computed(() => query.data?.value?.productType);

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.productType?.products?.edges;
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

const {
  loading,
  loaded,
  error,
  empty,
  devtoolState,
  refresh: refresh_,
} = queryState;

const refreshing = ref(false);

const edges = computed(() =>
  refreshing.value || empty.value ? [] : readEdges(query)
);

const nodes = computed(() =>
  refreshing.value || empty.value ? [] : readNodes(query)
);

const nItemsTotal = computed(
  () => productType.value?.products?.totalCount || 0
);

async function refresh() {
  refreshing.value = true;
  first.value = nItemsInitialLoad.value;
  try {
    await refresh_();
  } finally {
    areAllCardsCollapsed.value = true;
    refreshing.value = false;
  }
}

const isCardCollapsed = reactive<{ [key: string]: boolean }>({});

const areAllCardsCollapsed = computed({
  get: () => Object.values(isCardCollapsed).every((i) => i),
  set: (v) => {
    Object.keys(isCardCollapsed).forEach((k) => {
      isCardCollapsed[k] = v;
    });
  },
});

const store = useStore();
const { nApolloMutations } = storeToRefs(store);
watch(nApolloMutations, refresh);
</script>
