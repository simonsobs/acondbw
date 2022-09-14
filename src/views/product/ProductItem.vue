<template>
  <v-container class="product-item" style="position: relative">
    <v-row>
      <v-col class="pb-0">
        <v-card-actions class="align-end" style="height: 56px">
          <v-tooltip v-if="node && node.type_" bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn
                text
                icon
                exact
                :to="{
                  name: 'ProductList',
                  params: { productTypeName: node.type_.name },
                }"
                v-on="on"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Back to the list</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn :disabled="loading" icon @click="refresh()" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="loading">
        <v-progress-circular
          indeterminate
          :size="26"
          color="secondary"
        ></v-progress-circular>
      </v-col>
      <v-col v-else-if="error">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>
      <v-col v-else-if="loaded && node" class="pt-0">
        <component
          :is="productItemCard"
          :productId="node.productId"
          :collapsible="false"
          @deleted="onDeleted"
          @nameChanged="onNameChanged($event)"
          @typeChanged="onTypeChanged($event)"
          :disableEdit="disableEdit"
          :disableDelete="disableDelete"
        ></component>
      </v-col>
      <v-col v-if="notFound">
        <v-card-text class="text-body-1">Not Found (404)</v-card-text>
      </v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
import { useStore } from "@/stores/main";

import PRODUCT_BY_TYPE_ID_AND_NAME from "@/graphql/queries/ProductByTypeIdAndName.gql";
import { ProductByTypeIdAndNameQuery } from "@/generated/graphql";

import ProductItemCard from "@/components/product/ProductItemCard.vue";

import { useQuery } from "@urql/vue";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default defineComponent({
  name: "ProductItem",
  components: {
    ProductItemCard,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productTypeId: { type: String, required: true },
    productItemCard: { default: "ProductItemCard" },
    disableEdit: { type: Boolean, default: false },
    disableDelete: { type: Boolean, default: false },
  },
  setup(prop) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const init = ref(true);
    const error = ref(null as any);
    const refreshing = ref(false);
    const devtoolState = ref<number | null>(null);
    const name = ref<string | null>(null);
    onMounted(() => {
      name.value = route.params.name;
    });
    const query = useQuery<ProductByTypeIdAndNameQuery>({
      query: PRODUCT_BY_TYPE_ID_AND_NAME,
      variables: { typeId: prop.productTypeId, name: name },
      pause: !name,
    });
    const node = computed(() => query.data?.value?.product);
    const productTypeName = computed(() => node.value?.type_?.name);
    watch(query.data, (data) => {
      if (data) init.value = false;
    });
    watch(query.error, (e) => {
      init.value = false;
      error.value = e?.message || null;
    });
    watch(
      () => store.nApolloMutations,
      () => {
        query.executeQuery({ requestPolicy: "network-only" });
      }
    );
    watch(devtoolState, (val) => {
      if (val) init.value = val === State.INIT;
      error.value = val === State.ERROR ? "Error from Dev Tools" : null;
    });
    const state = computed(() => {
      if (devtoolState.value !== null) return devtoolState.value;
      if (refreshing.value) return State.LOADING;
      if (query.fetching.value) return State.LOADING;
      if (error.value) return State.ERROR;
      if (node.value) return State.LOADED;
      if (init.value) return State.INIT;
      return State.NONE;
    });
    const loading = computed(() => state.value === State.LOADING);
    const loaded = computed(() => state.value === State.LOADED);
    const notFound = computed(() => state.value === State.NONE);
    async function refresh() {
      refreshing.value = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await query.executeQuery({ requestPolicy: "network-only" });
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      refreshing.value = false;
    }
    function onDeleted() {
      if (productTypeName.value === undefined)
        throw new Error("productTypeName is undefined");
      router.push({
        name: "ProductList",
        params: { productTypeName: productTypeName.value },
      });
    }
    function onNameChanged(event: string) {
      if (productTypeName.value === undefined)
        throw new Error("productTypeName is undefined");
      router.push({
        name: "ProductItem",
        params: {
          productTypeName: productTypeName.value,
          name: event,
        },
      });
    }
    function onTypeChanged(event: string) {
      if (name.value === null) throw new Error("name is null");
      router.push({
        name: "ProductItem",
        params: {
          productTypeName: event,
          name: name.value,
        },
      });
    }
    return {
      init,
      error,
      refreshing,
      devtoolState,
      state,
      State,
      loading,
      loaded,
      notFound,
      name,
      node,
      productTypeName,
      refresh,
      onDeleted,
      onNameChanged,
      onTypeChanged,
    };
  },
});
</script>
