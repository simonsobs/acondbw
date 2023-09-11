<template>
  <div class="top-bar">
    <refresh-button :disabled="loading" @refresh="emit('refresh')">
    </refresh-button>
    <div v-if="loaded && productType">
      <span v-if="nItemsTotal == 1">1 {{ productType.singular }}</span>
      <span v-else>{{ nItemsTotal }} {{ productType.plural }}</span>
    </div>
    <div v-show="loaded && nItemsTotal > 1">
      <sort-menu-button
        :model-value="sort"
        @update:model-value="emit('update:sort', $event)"
      >
      </sort-menu-button>
    </div>
    <div v-if="loaded">
      <toggle-collapse-all-button
        :model-value="areAllCardsCollapsed"
        @update:model-value="emit('update:areAllCardsCollapsed', $event)"
      >
      </toggle-collapse-all-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ProductSortEnum,
  QueryForProductListQuery,
} from "@/graphql/codegen/generated";

import RefreshButton from "./RefreshButton.vue";
import SortMenuButton from "./SortMenuButton.vue";
import ToggleCollapseAllButton from "./ToggleCollapseAllButton.vue";

type ProductType = QueryForProductListQuery["productType"];

interface Props {
  loading: boolean;
  loaded: boolean;
  productType?: ProductType;
  sort: ProductSortEnum[];
  areAllCardsCollapsed: boolean;
}

interface Emits {
  (event: "refresh"): void;
  (event: "update:sort", value: ProductSortEnum[]): void;
  (event: "update:areAllCardsCollapsed", value: boolean): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const nItemsTotal = computed(() => prop.productType?.products?.totalCount || 0);
</script>

<style scoped>
.top-bar {
  display: flex;
  min-block-size: 56px;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 1rem;
}
</style>
