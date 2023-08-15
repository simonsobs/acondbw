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
        <component
          :is="productItemCard"
          v-for="node in nodes"
          :key="node.id"
          :productId="Number(node.productId)"
          :collapsible="true"
          v-model:collapsed="isCardCollapsed[node.id]"
          class="my-1"
        ></component>
        <div v-if="loading" class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
        <div v-if="showLoadMoreButton && productType">
          <div class="bottom-bar">
            <div></div>
            <div v-if="nItemsTotal > 1">
              <span v-if="nodes.length == nItemsTotal">
                {{ nItemsTotal }} {{ productType.plural }}
              </span>
              <span v-else>
                {{ edges.length }} of {{ nItemsTotal }}
                {{ productType.plural }}
              </span>
            </div>
            <v-btn
              v-if="productType && productType.products"
              :disabled="!productType.products.pageInfo.hasNextPage"
              variant="tonal"
              color="primary"
              @click="loadMore()"
              text="Load more"
            >
            </v-btn>
          </div>
        </div>
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
import { ref, reactive, watch, computed, withDefaults } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
import { useConfigStore } from "@/stores/config";

import TopBar from "./TopBar.vue";
import ProductItemCard from "@/components/product/item-card/ProductItemCard.vue";
import Empty from "./Empty.vue";

import {
  useQueryForProductListQuery,
  ProductSortEnum,
} from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

// Use any for productItemCard because Component causes an error for unknown reason.
const props = withDefaults(
  defineProps<{
    productTypeId: number;
    productItemCard?: any;
  }>(),
  {
    productItemCard: () => ProductItemCard,
  }
);

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

watch(nodes, async () => {
  collapseCards();
  await loadAllFewRemainingItems();
});

async function loadAllFewRemainingItems() {
  if (
    nodes.value.length + nExtraItemsAutomaticLoad.value >=
    nItemsTotal.value
  ) {
    await loadMore();
  }
}

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

function collapseCards() {
  nodes.value.forEach((node) => {
    const id = node.id;
    if (id in isCardCollapsed) return;
    isCardCollapsed[id] = true;
  });
}
collapseCards();

const areAllCardsCollapsed = computed({
  get: () => Object.values(isCardCollapsed).every((i) => i),
  set: (v) => {
    Object.keys(isCardCollapsed).forEach((k) => {
      isCardCollapsed[k] = v;
    });
  },
});

const loadingMore = ref(false);

// Set temporarily to 0 for the error
// https://actcollaboration.slack.com/archives/C7WJA7X45/p1686667739493689
// Note: The error doesn't occur in local development environment.
// const nExtraItemsAutomaticLoad = ref(2);
const nExtraItemsAutomaticLoad = ref(0);

const showLoadMoreButton = computed(() => {
  // if (loadingMore.value) return false;
  return (
    nItemsTotal.value > nItemsInitialLoad.value + nExtraItemsAutomaticLoad.value
  );
});

const nItemsPerLoad = ref(20);
async function loadMore() {
  if (!productType.value?.products?.pageInfo?.hasNextPage) return;
  first.value = first.value + nItemsPerLoad.value;
}

const store = useStore();
const { nApolloMutations } = storeToRefs(store);
watch(nApolloMutations, refresh);
</script>

<style scoped>
.bottom-bar {
  display: flex;
  margin-top: 16px;
  min-block-size: 56px;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 1rem;
}
</style>
