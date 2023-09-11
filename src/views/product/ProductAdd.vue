<template>
  <div class="product-add my-5" style="block-size: 100%; position: relative">
    <div v-if="notFound" class="not-found">
      <span class="text-h1 text-center"> Not Found (404) </span>
    </div>
    <v-progress-linear v-else-if="loading" indeterminate color="primary">
    </v-progress-linear>
    <div v-else-if="error" class="pa-5">
      <v-alert
        type="error"
        variant="tonal"
        :text="error"
        class="mx-auto"
        max-width="960px"
      >
      </v-alert>
    </div>
    <product-add-form
      v-else-if="on && loaded && productTypeId"
      :productTypeId="productTypeId"
      @finished="finished"
    ></product-add-form>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onActivated } from "vue";
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

function onEntered() {
  if (init.value) return;
  query.executeQuery({ requestPolicy: "network-only" });
  recreateForm();
}

function recreateForm() {
  // A component will be re-instantiated
  // when v-if becomes once false and then true.
  on.value = false;
  console.log("recreateForm");
  nextTick(() => {
    console.log("nextTick");
    on.value = true;
  });
}
const on = ref(true);
const queryState = useQueryState(query, {
  isNull: () => node.value === null,
});
const { init, notFound, loading, error, loaded, devtoolState } = queryState;

onEntered();
onActivated(onEntered);
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
