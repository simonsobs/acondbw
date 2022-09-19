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
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
import { useQuery } from "@urql/vue";

import PRODUCT_TYPE_BY_NAME from "@/graphql/queries/ProductTypeByName.gql";
import { ProductTypeByNameQuery } from "@/generated/graphql";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ProductAddForm from "@/components/product/ProductAddForm.vue";

export default defineComponent({
  name: "ProductAdd",
  components: {
    ProductAddForm,
    DevToolLoadingStateOverridingMenu,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const init = ref(true);
    const error = ref<string | null>(null);
    const devtoolState = ref<number | null>(null);
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
    watch(query.data, (data) => {
      if (data) init.value = false;
    });
    watch(query.error, (e) => {
      init.value = false;
      error.value = e?.message || null;
    });
    watch(devtoolState, (val) => {
      if (val) init.value = val === State.INIT;
      error.value = val === State.ERROR ? "Error from Dev Tools" : null;
    });
    const state = computed(() => {
      if (devtoolState.value !== null) return devtoolState.value;
      if (query.fetching.value) return State.LOADING;
      if (error.value) return State.ERROR;
      if (node.value) return State.LOADED;
      if (init.value) return State.INIT;
      return State.NONE;
    });
    const loading = computed(() => state.value === State.LOADING);
    const loaded = computed(() => state.value === State.LOADED);
    const notFound = computed(() => state.value === State.NONE);
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
    return {
      on,
      init,
      error,
      devtoolState,
      State,
      productTypeName,
      productTypeId,
      query,
      node,
      state,
      loading,
      loaded,
      notFound,
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
