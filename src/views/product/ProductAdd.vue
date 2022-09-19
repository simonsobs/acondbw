<template>
  <v-container
    :fill-height="notFound"
    class="product-add"
    style="position: relative"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="18"
      :width="3"
      color="secondary"
    ></v-progress-circular>
    <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
    <product-add-form
      v-else-if="on && loaded && productTypeId"
      :productTypeId="productTypeId"
      @finished="finished"
    ></product-add-form>
    <v-row v-else-if="notFound" align="center" justify="center">
      <v-col class="text-h1 text-center">Not Found (404)</v-col>
    </v-row>
    <dev-tool-loading-state-menu
      top="-10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
import { useQuery } from "@urql/vue";

import PRODUCT_TYPE_BY_NAME from "@/graphql/queries/ProductTypeByName.gql";
import { ProductTypeByNameQuery } from "@/generated/graphql";

import ProductAddForm from "@/components/product/ProductAddForm.vue";

import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";
import { useQueryState } from "@/utils/query-state";

export default defineComponent({
  name: "ProductAdd",
  components: {
    DevToolLoadingStateMenu,
    ProductAddForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productTypeName = computed(() => route.params.productTypeName);
    const query = useQuery<ProductTypeByNameQuery>({
      query: PRODUCT_TYPE_BY_NAME,
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
      nextTick(() => {
        on.value = true;
      });
    }
    const on = ref(true);
    const queryState = useQueryState(query, { isNull: () => node === null});
    const { init } = queryState;
    return {
      ...queryState,
      on,
      productTypeName,
      productTypeId,
      query,
      node,
      finished,
      onEntered,
      recreateForm,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // @ts-ignore
      vm.onEntered();
    });
  },
});
</script>
