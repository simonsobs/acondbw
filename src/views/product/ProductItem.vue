<template>
  <v-container class="product-item" style="position: relative">
    <v-row>
      <v-col class="pb-0">
        <v-card-actions class="align-end" style="height: 56px">
          <v-tooltip v-if="node && node.type_" bottom open-delay="800">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="plain"
                icon
                :to="{
                  name: 'ProductList',
                  params: { productTypeName: node.type_.name },
                }"
              >
                <v-icon icon="mdi-arrow-left"></v-icon>
              </v-btn>
            </template>
            <span>Back to the list</span>
          </v-tooltip>
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :disabled="loading"
                variant="plain"
                icon
                @click="refresh()"
              >
                <v-icon icon="mdi-refresh"></v-icon>
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
          :productId="Number(node.productId)"
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
    <dev-tool-loading-state-menu
      top="-10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useProductByTypeIdAndNameQuery } from "@/generated/graphql";

import ProductItemCard from "@/components/product/ProductItemCard.vue";

import { useQueryState } from "@/utils/query-state";

// Use any for productItemCard because Component causes an error for unknown reason.
const props = withDefaults(
  defineProps<{
    productTypeId: number;
    productItemCard?: any;
    disableEdit?: boolean;
    disableDelete?: boolean;
  }>(),
  {
    productItemCard: () => ProductItemCard,
    disableEdit: false,
    disableDelete: false,
  }
);

const route = useRoute();
const router = useRouter();

const name = ref<string>("");

onMounted(() => {
  name.value = route.params.name || "";
});

const query = useProductByTypeIdAndNameQuery({
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
