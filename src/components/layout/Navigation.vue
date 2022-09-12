<template>
  <div class="navigation">
    <v-card flat>
      <v-list v-if="loaded" shaped>
        <v-list-item
          link
          router
          v-for="edge in edges"
          :key="edge.node.typeId"
          :to="{
            name: 'ProductList',
            params: { productTypeName: edge.node.name },
          }"
        >
          <v-list-item-action class="mr-5">
            <v-icon v-text="edge.node.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              v-text="edge.node.plural"
              class="capitalize condensed-font font-weight-medium"
            ></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon class="ml-2">
            <v-chip
              small
              v-if="!!edge.node.products.totalCount"
              v-text="edge.node.products.totalCount"
            ></v-chip>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
      <v-card-text v-if="empty" outlined dense type="info" class="ma-2">
        No product types are defined.
      </v-card-text>
      <v-card-actions v-if="loaded || empty" class="px-5 py-0">
        <v-spacer></v-spacer>
        <v-tooltip left open-delay="800">
          <template v-slot:activator="{ on: tooltip }">
            <v-dialog persistent v-model="addDialog" max-width="800">
              <template v-slot:activator="{ on: addDialog }">
                <v-btn icon v-on="{ ...tooltip, ...addDialog }">
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
      ></v-progress-circular>
      <v-alert v-if="error" outlined dense type="error" class="ma-2">
        {{ error }}
      </v-alert>
    </v-card>
    <v-bottom-navigation absolute class="px-3 justify-start align-center">
      <span class="grey--text text-caption"> v{{ appVersion }} </span>
      <!-- <v-spacer></v-spacer>
      <v-icon>mdi-plus-thick</v-icon> -->
    </v-bottom-navigation>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "@/stores/main";
import { useQuery } from "@urql/vue";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ProductTypeAddForm from "@/components/product-type/ProductTypeAddForm.vue";

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
  name: "Navigation",
  components: {
    DevToolLoadingStateOverridingMenu,
    ProductTypeAddForm,
  },
  setup() {
    const store = useStore();
    const init = ref(true);
    const error = ref(null as any);
    const devtoolState = ref<number | null>(null);
    const edges = ref<ProductTypeEdge[]>([]);
    const query = useQuery<{ allProductTypes: ProductTypeConnection }>({
      query: ALL_PRODUCT_TYPES,
    });
    watch(query.data, (data) => {
      if (data) {
        init.value = false;
        edges.value = data.allProductTypes.edges;
      }
    });
    watch(query.error, (e) => {
      init.value = false;
      error.value = e || null;
    });
    watch(
      () => store.nApolloMutations,
      () => {
        query.executeQuery({ requestPolicy: "network-only" });
      }
    );
    watch(devtoolState, (val) => {
      if(val) init.value = val === State.INIT
      error.value = val === State.ERROR ? "Error from Dev Tools" : null;
    });

    const state = computed(() => {
      if (devtoolState.value !== null) return devtoolState.value;
      if (query.fetching.value) return State.LOADING;
      if (error.value) return State.ERROR;
      if (edges.value.length === 0) return State.EMPTY;
      return State.LOADED;
    });

    const loading = computed(() => state.value === State.LOADING);
    const loaded = computed(() => state.value === State.LOADED);
    const empty = computed(() => state.value === State.EMPTY);
    const notFound = computed(() => state.value === State.NONE);

    const addDialog = ref(false);

    function onAddFormCancelled() {
      closeAddForm()
    }
    function onAddFormFinished() {
      closeAddForm()
    }
    function closeAddForm() {
      addDialog.value = false;
    }

    return {
      init,
      error,
      devtoolState,
      edges,
      state,
      loading,
      loaded,
      empty,
      notFound,
      addDialog,
      onAddFormCancelled,
      onAddFormFinished,
      closeAddForm,
      appVersion: store.appVersion
    };
  },
});
</script>
