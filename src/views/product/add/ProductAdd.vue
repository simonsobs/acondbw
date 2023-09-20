<template>
  <div class="product-add my-5" style="block-size: 100%; position: relative">
    <div v-if="notFound" class="not-found">
      <span class="text-h1 text-center"> Not Found (404) </span>
    </div>
    <v-progress-linear v-else-if="loading" indeterminate color="primary">
    </v-progress-linear>
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      :text="error"
      class="mx-auto"
      max-width="960px"
    >
    </v-alert>
    <product-add-form
      v-else-if="loaded && productTypeId"
      :productTypeId="productTypeId"
      @finished="finished"
    ></product-add-form>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useProductTypeByNameQuery } from "@/graphql/codegen/generated";

import ProductAddForm from "@/components/product/form/ProductAddForm.vue";

import { useQueryState } from "@/utils/query-state";

const route = useRoute();
const router = useRouter();
const productTypeName = computed(() => route.params.productTypeName);
const query = useProductTypeByNameQuery({
  // @ts-ignore
  variables: { name: productTypeName },
});
const node = computed(() => query.data?.value?.productType);
const productTypeId = computed(() => {
  const typeId = Number(node.value?.typeId);
  return isNaN(typeId) ? undefined : typeId;
});
function finished() {
  router.push({
    name: "ProductList",
    params: { productTypeName: productTypeName.value },
  });
}

const queryState = useQueryState(query, {
  isNull: () => node.value === null,
});
const { notFound, loading, error, loaded, devtoolState } = queryState;
</script>

<style scoped>
.not-found {
  display: grid;
  block-size: 100%;
  place-items: center;
}

.product-add:deep(.v-sheet) {
  background-color: rgb(var(--v-theme-surface-container-lowest));
}
</style>
