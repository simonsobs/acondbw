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
          <span class="capitalize font-weight-bold primary--text">{{
            item.plural
          }}</span>
        </router-link>
      </template>
    </v-data-table>
    <v-alert v-if="error" type="error" style="width: 100%">{{ error }}</v-alert>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from "vue-router/composables";
import { useStore } from "@/stores/main";
import { useQuery } from "@urql/vue";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

interface ProductConnection {
  totalCount: number;
}

interface ProductType {
  id: string;
  typeId: string;
  name: string;
  plural: string;
  icon: string;
  products: ProductConnection;
}

interface ProductTypeEdge {
  node: ProductType;
}

interface ProductTypeConnection {
  edges: ProductTypeEdge[];
}

export default defineComponent({
  name: "Dashboard",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const error = ref(null as any);
    const devtoolState = ref<number | null>(null);
    const edges = ref<ProductTypeEdge[]>([]);
    const query = useQuery<{ allProductTypes: ProductTypeConnection }>({
      query: ALL_PRODUCT_TYPES,
    });
    watch(query.data, (data) => {
      if (data) {
        edges.value = data.allProductTypes.edges;
      }
    });
    watch(query.error, (e) => {
      error.value = e || null;
    });
    watch(
      () => store.nApolloMutations,
      () => {
        query.executeQuery({ requestPolicy: "network-only" });
      }
    );
    watch(devtoolState, (val) => {
      error.value = val === State.ERROR ? "Error from Dev Tools" : null;
    });

    const headers = ref([
      { text: "Product type", value: "plural" },
      {
        text: "Number of products",
        align: "end",
        value: "products.totalCount",
      },
    ]);

    const state = computed(() => {
      if (devtoolState.value !== null) return devtoolState.value;
      if (query.fetching.value) return State.LOADING;
      if (error.value) return State.ERROR;
      if (edges.value.length === 0) return State.EMPTY;
      return State.LOADED;
    });

    const loading = computed(() => state.value === State.LOADING);

    const items = computed(() => {
      if (state.value === State.NONE) return [];
      if (state.value === State.EMPTY) return [];
      return edges.value.map((edge) => edge.node);
    });

    function clickRow(item: ProductType) {
      router.push({
        name: "ProductList",
        params: { productTypeName: item.name },
      });
    }

    return {
      error,
      devtoolState,
      edges,
      headers,
      state,
      loading,
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
