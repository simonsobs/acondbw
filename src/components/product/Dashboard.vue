<template>
  <div class="dashboard" style="position: relative">
    <v-data-table
      v-if="items"
      :headers="headers"
      :items="items"
      :items-per-page="items.length"
      :loading="loading"
      disable-sort
      hide-default-footer
      @click:row="clickRow"
      class="elevation-1"
    >
      <template v-slot:[`item.plural`]="{ item }">
        <router-link
          :to="{ name: 'ProductList', params: { productTypeName: item.name } }"
        >
          <span class="capitalize font-weight-bold primary--text">
            {{ item.plural }}
          </span>
        </router-link>
      </template>
    </v-data-table>
    <v-alert v-if="error" type="error" style="width: 100%">{{ error }}</v-alert>
    <dev-tool-loading-state-menu
      top="-10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from "vue-router/composables";
import { useQuery } from "@urql/vue";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";
import { AllProductTypesQuery, ProductType } from "@/generated/graphql";

import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

import { useQueryState } from "@/utils/query-state";

export default defineComponent({
  name: "Dashboard",
  components: {
    DevToolLoadingStateMenu,
  },
  setup() {
    const router = useRouter();
    const query = useQuery<AllProductTypesQuery>({
      query: ALL_PRODUCT_TYPES,
    });
    function readEdges(
      query: ReturnType<typeof useQuery<AllProductTypesQuery>>
    ) {
      return query.data?.value?.allProductTypes?.edges?.flatMap((e) =>
        e ? [e] : []
      );
    }
    const edges = computed(() => readEdges(query) || []);

    const headers = ref([
      { text: "Product type", value: "plural" },
      {
        text: "Number of products",
        align: "end",
        value: "products.totalCount",
      },
    ]);

    function isEmpty(query: ReturnType<typeof useQuery<AllProductTypesQuery>>) {
      const edges = readEdges(query);
      return edges ? edges.length === 0 : false;
    }

    const items = computed(() =>
      edges.value.flatMap((edge) => (edge?.node ? [edge.node] : []))
    );

    function clickRow(item: ProductType) {
      router.push({
        name: "ProductList",
        params: { productTypeName: item.name },
      });
    }

    return {
      ...useQueryState(query, { isEmpty }),
      edges,
      headers,
      items,
      clickRow,
    };
  },
});
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.dashboard >>> tbody tr :hover {
  cursor: pointer;
}
</style>
