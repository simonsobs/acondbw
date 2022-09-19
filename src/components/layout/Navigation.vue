<template>
  <div class="navigation">
    <v-card flat>
      <v-list v-if="loaded" shaped>
        <v-list-item
          link
          router
          v-for="node in nodes"
          :key="node.typeId"
          :to="{
            name: 'ProductList',
            params: { productTypeName: node.name },
          }"
        >
          <v-list-item-action class="mr-5">
            <v-icon v-text="node.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              v-text="node.plural"
              class="capitalize condensed-font font-weight-medium"
            ></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon class="ml-2">
            <v-chip
              small
              v-if="node.products && node.products.totalCount"
              v-text="node.products.totalCount"
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
    <dev-tool-loading-state-menu
      top="-10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "@/stores/main";
import { useQuery } from "@urql/vue";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";
import { AllProductTypesQuery } from "@/generated/graphql";

import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

import ProductTypeAddForm from "@/components/product-type/ProductTypeAddForm.vue";

import { useQueryState } from "@/utils/query-state";


export default defineComponent({
  name: "Navigation",
  components: {
    DevToolLoadingStateMenu,
    ProductTypeAddForm,
  },
  setup() {
    const store = useStore();
    const query = useQuery<AllProductTypesQuery>({
      query: ALL_PRODUCT_TYPES,
    });

    function isEmpty(query: ReturnType<typeof useQuery<AllProductTypesQuery>>) {
      const edges = readEdges(query);
      return edges ? edges.length === 0 : false;
    }

    function readEdges(
      query: ReturnType<typeof useQuery<AllProductTypesQuery>>
    ) {
      return query.data?.value?.allProductTypes?.edges?.flatMap((e) =>
        e ? [e] : []
      );
    }
    const edges = computed(() => readEdges(query) || []);
    const nodes = computed(() =>
      edges.value.flatMap((e) => (e.node ? [e.node] : []))
    );

    const addDialog = ref(false);

    function onAddFormCancelled() {
      closeAddForm();
    }
    function onAddFormFinished() {
      closeAddForm();
    }
    function closeAddForm() {
      addDialog.value = false;
    }

    return {
      ...useQueryState(query, { isEmpty }),
      query,
      edges,
      nodes,
      addDialog,
      onAddFormCancelled,
      onAddFormFinished,
      closeAddForm,
      appVersion: store.appVersion,
    };
  },
});
</script>
