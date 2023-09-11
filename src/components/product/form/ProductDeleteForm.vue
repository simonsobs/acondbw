<template>
  <v-card class="product-delete-form pa-2" style="position: relative">
    <v-card-title v-if="loaded && node && node.type_">
      Delete the {{ node.type_.singular }}
    </v-card-title>
    <v-card-text v-if="error" class="py-2">
      <v-alert type="error" variant="tonal" class="my-2"> {{ error }} </v-alert>
    </v-card-text>
    <v-card-text v-if="mutationError" class="py-2">
      <v-alert type="error" variant="tonal" class="my-2">
        {{ mutationError }}
      </v-alert>
    </v-card-text>
    <template v-if="loaded && node && node.type_">
      <v-card-text class="body-1 font-weight-medium text-error">
        Really, delete the {{ node.type_.singular }} "{{ node.name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="cancel"> Cancel </v-btn>
        <v-btn color="error" @click="remove"> Delete </v-btn>
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
        <v-btn color="secondary" variant="text" @click="cancel"> Cancel </v-btn>
      </v-card-actions>
    </template>
    <dev-tool-loading-state-menu top="1px" right="1px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import { useProductQuery, useDeleteProductMutation } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

interface Props {
  productId: number; // product.productId not product.id
}

interface Emits {
  (event: "finished"): void;
  (event: "cancel"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();
const query = useProductQuery({
  variables: { productId: prop.productId },
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

const { executeMutation } = useDeleteProductMutation();

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

const { loading, error, loaded, notFound, devtoolState } = useQueryState(
  query,
  { isNull: () => node.value === null }
);
</script>
