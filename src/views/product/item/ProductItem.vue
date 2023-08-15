<template>
  <div
    class="my-5"
    style="block-size: 100%; position: relative; padding-bottom: 96px"
  >
    <div style="max-width: 960px; margin: auto">
      <top-bar :node="node" :disabled="loading" @refresh="refresh()"></top-bar>
      <div>
        <div v-if="loading">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
        <div v-else-if="error">
          <v-alert variant="tonal" type="error" :text="error"></v-alert>
        </div>
        <div v-else-if="loaded && node" class="pt-0">
          <product-item-card
            :productId="Number(node.productId)"
            :collapsible="false"
            @deleted="onDeleted"
            @nameChanged="onNameChanged($event)"
            @typeChanged="onTypeChanged($event)"
          ></product-item-card>
        </div>
        <div v-if="notFound">
          <v-card-text class="text-body-1">Not Found (404)</v-card-text>
        </div>
      </div>
    </div>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useProductByTypeIdAndNameQuery } from "@/generated/graphql";
import { useQueryState } from "@/utils/query-state";

import TopBar from "./TopBar.vue";
import ProductItemCard from "@/components/product/item-card/ProductItemCard.vue";

interface Props {
  productTypeId: number;
}

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const name = ref<string>("");

onMounted(() => {
  name.value = (route.params.name as string) || "";
});

const query = useProductByTypeIdAndNameQuery({
  // @ts-ignore
  variables: { typeId: props.productTypeId, name: name },
  pause: !name,
});

const node = computed(() => query.data?.value?.product);
const productTypeName = computed(() => node.value?.type_?.name);

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

const queryState = useQueryState(query, { isNull: () => node.value === null });
const { loading, loaded, notFound, error, refresh, devtoolState } = queryState;
</script>
