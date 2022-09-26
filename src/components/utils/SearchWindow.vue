<template>
  <v-autocomplete
    class="search-window"
    outlined
    rounded
    dense
    flat
    hide-details
    solo
    prepend-inner-icon="mdi-magnify"
    placeholder="Type a product name"
    :items="items"
    v-model="value"
    @input="input"
    @focus="focus"
  ></v-autocomplete>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router/composables";

import { useQueryForSearchWindowQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

export default defineComponent({
  name: "SearchWindow",
  setup() {
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
                  text: `${edge.node.name} (${edge.node.type_?.singular})`,
                  value: edge.node,
                }
              : []
          )
        : []
    );
    type Item = typeof items.value[0]["value"];
    const value = ref<Item | null>(null);

    function focus() {
      s.value += 1;
    }

    function input(selected: Item) {
      if (!selected.type_)  return; 
      router.push({
        name: "ProductItem",
        params: { productTypeName: selected.type_.name, name: selected.name },
      });
      nextTick(() => {
        value.value = null;
      });
    }

    return {
      ...useQueryState(query),// for nApolloMutations
      s,
      edges,
      items,
      value,
      focus,
      input,
    };
  },
});
</script>
