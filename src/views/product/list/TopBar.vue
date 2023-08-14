<template>
  <div class="top-bar">
    <v-tooltip>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          :disabled="loading"
          icon
          @click="emit('refresh')"
        >
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </template>
      <span>Refresh</span>
    </v-tooltip>
    <div v-if="loaded && productType">
      <span v-if="nItemsTotal == 1">1 {{ productType.singular }}</span>
      <span v-else>{{ nItemsTotal }} {{ productType.plural }}</span>
    </div>
    <div v-if="loaded && nItemsTotal > 1">
      <v-tooltip>
        <template v-slot:activator="{ props: tooltip }">
          <v-menu left offset-y>
            <template v-slot:activator="{ props: menu }">
              <v-btn v-bind="{ ...tooltip, ...menu }" variant="text" icon>
                <v-icon icon="mdi-sort-variant"></v-icon>
              </v-btn>
            </template>
            <v-list flat dense v-model:selected="sortSelected">
              <v-list-item title="Sort"> </v-list-item>
              <v-list-item
                v-for="(item, i) in sortItems"
                :key="i"
                :value="item"
                :title="item.title"
              >
                <template v-slot:prepend>
                  <v-icon v-if="item == sortItem" icon="mdi-check"> </v-icon>
                  <v-icon v-else> </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <span>Sort</span>
      </v-tooltip>
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
import { ref, computed, watchEffect } from "vue";
import { ProductSortEnum, QueryForProductListQuery } from "@/generated/graphql";

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

const sortItems = ref([
  { title: "Recently posted", value: ProductSortEnum.TimePostedDesc },
  { title: "Recently updated", value: ProductSortEnum.TimeUpdatedDesc },
  { title: "Name", value: ProductSortEnum.NameAsc },
]);
const sortSelected = ref([sortItems.value[0]]);
const sortItem = computed(() => sortSelected.value[0]);
const sort = computed(() => [sortItem.value.value]);
watchEffect(() => emit("update:sort", sort.value));
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
