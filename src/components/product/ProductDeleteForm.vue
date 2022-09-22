<template>
  <v-card class="product-delete-form" style="position: relative">
    <v-card-title v-if="loaded && node && node.type_">
      Delete the {{ node.type_.singular }}
    </v-card-title>
    <v-card-text v-if="error" class="py-2">
      <v-alert type="error" class="my-2">{{ error }}</v-alert>
    </v-card-text>
    <v-card-text v-if="mutationError" class="py-2">
      <v-alert type="error" class="my-2">{{ mutationError }}</v-alert>
    </v-card-text>
    <template v-if="loaded && node && node.type_">
      <v-card-text class="body-1 font-weight-medium error--text">
        Really, delete the {{ node.type_.singular }} "{{ node.name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
        <v-btn color="error" @click="remove">Delete</v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-text v-if="loading" class="pa-4">
        <v-progress-circular
          indeterminate
          :size="18"
          :width="3"
          color="secondary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text
        v-else-if="notFound"
        class="body-1 font-weight-medium text-center pa-4"
      >
        Not Found
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </template>
    <dev-tool-loading-state-menu
      top="1px"
      right="1px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/stores/main";
import { useQuery, useMutation } from "@urql/vue";

import PRODUCT from "@/graphql/queries/Product.gql";
import DELETE_PRODUCT from "@/graphql/mutations/DeleteProduct.gql";
import {
  ProductQuery,
  ProductQueryVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
} from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

export default defineComponent({
  name: "ProductDeleteForm",
  props: {
    productId: { type: Number, required: true }, // product.productId not product.id
  },
  setup(prop, { emit }) {
    const store = useStore();
    const query = useQuery<ProductQuery>({
      query: PRODUCT,
      variables: { productId: prop.productId } as ProductQueryVariables,
    });
    const node = computed(() => query.data?.value?.product);

    const mutationError = ref<string | null>(null);
    function cancel() {
      emit("cancel");
      delayedReset();
    }
    function delayedReset() {
      // reset 0.5 sec after so that the reset form won't be shown.
      setTimeout(() => {
        reset();
      }, 500);
    }
    function reset() {
      mutationError.value = null;
    }

    const { executeMutation } = useMutation<
      DeleteProductMutation,
      DeleteProductMutationVariables
    >(DELETE_PRODUCT);

    async function remove() {
      try {
        const { error } = await executeMutation({
          productId: prop.productId,
        });
        if (error) throw error;
        store.apolloMutationCalled();
        store.setSnackbarMessage("Deleted");
        emit("finished");
        delayedReset();
      } catch (e: any) {
        mutationError.value = (e as Error).toString();
      }
    }

    return {
      ...useQueryState(query, { isNull: () => node.value === null }),
      node,
      mutationError,
      cancel,
      remove,
    };
  },
});
</script>
