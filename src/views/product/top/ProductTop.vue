<template>
  <div style="block-size: 100%; position: relative">
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
    <div
      v-else-if="loaded && node"
      class="pt-5 px-5"
      style="max-width: 960px; margin: auto"
    >
      <top-bar :node="node" :item-name="itemName"></top-bar>
      <router-view v-slot="{ Component }">
        <component
          :key="route.fullPath"
          :productTypeId="node ? Number(node.typeId) : null"
          :is="Component"
        ></component>
      </router-view>
    </div>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
// <keep-alive> is not used around <component> because it doesn't work well with
// <transition> set in App.vue.

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useProductTypeByNameQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

import TopBar from "./TopBar.vue";

const route = useRoute();

const productTypeName = ref<string | null>(null);
const itemName = ref<string | null>(null);
onMounted(() => {
  productTypeName.value = route.params.productTypeName as string;
  itemName.value = (route.params.name || null) as string | null;
});

const query = useProductTypeByNameQuery({
  // @ts-ignore
  variables: { name: productTypeName },
  pause: !productTypeName,
});

const node = computed(() => query.data?.value?.productType);

const { loading, loaded, notFound, error, devtoolState } = useQueryState(
  query,
  { isNull: () => node.value === null }
);
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.not-found {
  display: grid;
  block-size: 100%;
  place-items: center;
}
</style>
