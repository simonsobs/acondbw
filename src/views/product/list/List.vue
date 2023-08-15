<template>
  <product-item-card
    v-for="node in nodes"
    :key="node.id"
    :productId="Number(node.productId)"
    :collapsible="true"
    v-model:collapsed="isCardCollapsed[node.id]"
    class="my-1"
  >
  </product-item-card>
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
</template>

<script setup lang="ts">
import { ref, computed, toRefs, watch, watchEffect } from "vue";
import { QueryForProductListQuery } from "@/generated/graphql";
import ProductItemCard from "@/components/product/item-card/ProductItemCard.vue";

type ProductType = NonNullable<QueryForProductListQuery["productType"]>;
type Edge = NonNullable<NonNullable<ProductType["products"]>["edges"][0]>;
type Node = NonNullable<NonNullable<Edge>["node"]>;

interface Props {
  loading: boolean;
  productType: ProductType;
  edges: Edge[];
  nodes: Node[];
  nItemsTotal: number;
  nItemsInitialLoad: number;
  first: number;
  isCardCollapsed: Record<string, boolean>;
}

interface Emits {
  (event: "update:first", payload: number): boolean;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const { productType, nodes, nItemsTotal, nItemsInitialLoad } = toRefs(prop);
const first = ref(prop.first);
const isCardCollapsed = prop.isCardCollapsed;

watchEffect(() => {
  first.value = prop.first;
});
watchEffect(() => {
  emit("update:first", first.value);
});

const loadingMore = ref(false);

// Set temporarily to 0 for the error
// https://actcollaboration.slack.com/archives/C7WJA7X45/p1686667739493689
// Note: The error doesn't occur in local development environment.
// const nExtraItemsAutomaticLoad = ref(2);
const nExtraItemsAutomaticLoad = ref(0);


watch(nodes, async () => {
  collapseCards();
  await loadAllFewRemainingItems();
});

function collapseCards() {
  nodes.value.forEach((node) => {
    const id = node.id;
    if (id in isCardCollapsed) return;
    isCardCollapsed[id] = true;
  });
}
collapseCards();

const showLoadMoreButton = computed(() => {
  // if (loadingMore.value) return false;
  return (
    nItemsTotal.value > nItemsInitialLoad.value + nExtraItemsAutomaticLoad.value
  );
});

async function loadAllFewRemainingItems() {
  if (
    nodes.value.length + nExtraItemsAutomaticLoad.value >=
    nItemsTotal.value
  ) {
    await loadMore();
  }
}

const nItemsPerLoad = ref(20);
async function loadMore() {
  if (!productType.value?.products?.pageInfo?.hasNextPage) return;
  first.value = first.value + nItemsPerLoad.value;
}
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
