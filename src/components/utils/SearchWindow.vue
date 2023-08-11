<template>
  <span style="width: 400px;">
    <v-autocomplete
      class="search-window"
      variant="outlined"
      density="comfortable"
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="Type a product name"
      :items="items"
      v-model="value"
      @update:model-value="input"
      @update:focused="focus"
    ></v-autocomplete>
    </span>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";

import { useQueryForSearchWindowQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

const router = useRouter();
const s = ref(0);

const query = useQueryForSearchWindowQuery();
// const edges = computed(() => query.data?.value?.allProducts?.edges);
const edges = computed(() =>
  query.data?.value?.allProducts?.edges.flatMap((e) => (e ? e : []))
);
const items = computed(() =>
  edges.value
    ? edges.value.flatMap((edge) =>
        edge.node
          ? {
              title: `${edge.node.name} (${edge.node.type_?.singular})`,
              value: edge.node,
            }
          : []
      )
    : []
);
type Item = (typeof items.value)[0]["value"];
const value = ref<Item | null>(null);

function focus() {
  // s.value += 1;
}

function input(selected: Item) {
  if (!selected.type_) return;
  router.push({
    name: "ProductItem",
    params: { productTypeName: selected.type_.name, name: selected.name },
  });
  nextTick(() => {
    value.value = null;
  });
}

const {} = useQueryState(query); // for nApolloMutations
</script>
