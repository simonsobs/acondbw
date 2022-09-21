<template>
  <v-card-text class="" style="position: relative">
    <v-data-table
      :loading="loading"
      loading-text="Loading..."
      :headers="headers"
      :items="items"
      :items-per-page="items.length"
      :hide-default-footer="true"
      class="elevation-1"
      @click:row="onClickRow"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn :disabled="loading" icon @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab class="secondary">
            <v-icon class="on-secondary--text">mdi-plus-thick</v-icon>
          </v-btn>
        </v-toolbar>
        <v-alert dismissible v-model="alert" type="error">
          {{ error }}
        </v-alert>
      </template>
      <template v-slot:item.icon="{ item }">
        <v-icon v-text="item.icon"></v-icon>
      </template>
      <template v-slot:item.name="{ item }">
        <span class="font-weight-bold primary--text">{{ item.name }}</span>
      </template>
      <template v-slot:item.products.totalCount="{ item }">
        <v-chip v-text="item.products.totalCount"></v-chip>
      </template>
      <template v-slot:item.actions>
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <dev-tool-loading-state-menu
      top="-40px"
      right="10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useQuery } from "@urql/vue";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";
import { AllProductTypesQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

export default defineComponent({
  name: "ProductTypeTable",
  setup() {
    const query = useQuery<AllProductTypesQuery>({
      query: ALL_PRODUCT_TYPES,
    });
    const edges = computed(
      () =>
        query.data?.value?.allProductTypes?.edges?.flatMap((e) =>
          e ? [e] : []
        ) || []
    );

    const items = computed(() =>
      edges.value.flatMap((e) => (e.node ? [e.node] : []))
    );

    function onClickRow(item: typeof items.value[number]) {
      // console.log(item);
    }

    const headers = ref([
      { text: "Icon", value: "icon", sortable: false, width: "90px" },
      { text: "Name", value: "name", sortable: false },
      { text: "Singular", value: "singular", sortable: false },
      { text: "Plural", value: "plural", sortable: false },
      {
        text: "Count",
        value: "products.totalCount",
        sortable: false,
        width: "90px",
        align: "center",
      },
      { text: "Actions", value: "actions", sortable: false, align: "end" },
    ]);

    const queryState = useQueryState(query, {
      isEmpty: () => edges.value.length === 0,
    });
    const { error } = queryState;
    const alert = ref(false);

    watch(error, (val) => {
      alert.value = !!val;
    });

    watch(alert, (val) => {
      if (!val) error.value = null;
    });

    return {
      ...queryState,
      alert,
      edges,
      onClickRow,
      headers,
      items,
    };
  },
});
</script>
