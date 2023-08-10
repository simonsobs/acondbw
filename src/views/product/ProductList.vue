<template>
  <div class="my-5" style="block-size: 100%; position: relative">
    <div v-if="error">
      <v-alert variant="tonal" type="error" :text="error"> </v-alert>
    </div>
    <div class="top-bar">
      <v-tooltip bottom open-delay="800">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            :disabled="loading"
            icon
            @click="refresh()"
          >
            <v-icon icon="mdi-refresh"></v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
      <div v-if="loaded && productType">
        <span v-if="nItemsTotal == 1">1 {{ productType.singular }}</span>
        <span v-else>{{ nItemsTotal }} {{ productType.plural }}</span>
      </div>
      <div v-if="loaded && nItemsTotal > 1">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ props: tooltip }">
            <v-menu left offset-y>
              <template v-slot:activator="{ props: menu }">
                <v-btn v-bind="{ ...tooltip, ...menu }" variant="text" icon>
                  <v-icon icon="mdi-sort-variant"></v-icon>
                </v-btn>
              </template>
              <v-list flat dense v-model:selected="sortSelected">
                <v-list-item title="Sort"> </v-list-item>
                <v-list-item
                  v-for="(item, i) in sortItems"
                  :key="i"
                  :value="item"
                  :title="item.title"
                >
                  <template v-slot:prepend>
                    <v-icon v-if="item == sortItem" icon="mdi-check"> </v-icon>
                    <v-icon v-else> </v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <span>Sort</span>
        </v-tooltip>
      </div>
      <div v-if="loaded">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              icon
              @click="areAllCardsCollapsed = !areAllCardsCollapsed"
            >
              <v-icon
                :icon="
                  areAllCardsCollapsed
                    ? 'mdi-unfold-more-horizontal'
                    : 'mdi-unfold-less-horizontal'
                "
              >
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ areAllCardsCollapsed ? "Expand all" : "Collapse all" }}
          </span>
        </v-tooltip>
      </div>
    </div>
    <div>
      <div v-if="nodes.length" class="pt-0 pb-16">
        <component
          :is="productItemCard"
          v-for="node in nodes"
          :key="node.id"
          :productId="Number(node.productId)"
          :collapsible="true"
          :collapsed="isCardCollapsed[node.id]"
          v-on:expand="isCardCollapsed[node.id] = false"
          v-on:collapse="isCardCollapsed[node.id] = true"
          :disableEdit="disableEdit"
          :disableDelete="disableDelete"
          class="my-1"
        ></component>
        <div v-if="loading" class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
        <div v-if="showLoadMoreButton && productType" class="bottom-bar">
          <div></div>
          <div v-if="nItemsTotal > 1">
            <span v-if="nodes.length == nItemsTotal">
              {{ nItemsTotal }} {{ productType.plural }}
            </span>
            <span v-else>
              {{ edges.length }} of {{ nItemsTotal }}
              {{ productType.plural }}
            </span>
          </div>
          <v-btn
            v-if="productType && productType.products"
            :disabled="!productType.products.pageInfo.hasNextPage"
            variant="tonal"
            color="primary"
            @click="loadMore()"
            text="Load more"
          >
          </v-btn>
        </div>
      </div>
      <div v-else-if="loading">
        <div class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-else-if="empty && productType" class="empty">
        <div class="text-body-1 font-weight-medium">
          Empty. No {{ productType.plural }} are found.
        </div>
        <v-btn
          depressed
          variant="flat"
          :to="{
            name: 'ProductAdd',
            params: { productTypeName: productType.name },
          }"
          prepend-icon="mdi-plus-thick"
          text="Add the first entry"
        >
        </v-btn>
        <v-dialog v-model="deleteDialog" max-width="600">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="outlined"
              color="secondary"
              :disabled="disableDelete"
              prepend-icon="mdi-delete"
              text="Delete this product type"
            >
            </v-btn>
          </template>
          <product-type-delete-form
            v-if="deleteDialog"
            :node="productType"
            @cancel="onDeleteFormCancelled"
            @finished="onDeleteFormFinished"
          ></product-type-delete-form>
        </v-dialog>
      </div>
    </div>
    <v-btn
      :disabled="disableAdd"
      icon
      variant="flat"
      size="x-large"
      color="tertiary-container"
      elevation="8"
      :to="{
        name: 'ProductAdd',
        params: { productTypeName: productType.name },
      }"
      v-if="loaded && !empty && productType"
      style="position: fixed; bottom: 24px; right: 24px"
    >
      <v-icon icon="mdi-plus-thick"></v-icon>
    </v-btn>
    <dev-tool-loading-state-menu top="0" right="-35px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, withDefaults } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

import ProductItemCard from "@/components/product/ProductItemCard.vue";

import {
  useQueryForProductListQuery,
  ProductSortEnum,
} from "@/generated/graphql";

import ProductTypeDeleteForm from "@/components/product-type/ProductTypeDeleteForm.vue";

import { useQueryState } from "@/utils/query-state";

// Use any for productItemCard because Component causes an error for unknown reason.
const props = withDefaults(
  defineProps<{
    productTypeId: number;
    productItemCard?: any;
    disableAdd?: boolean;
    disableEdit?: boolean;
    disableDelete?: boolean;
  }>(),
  {
    productItemCard: () => ProductItemCard,
    disableAdd: false,
    disableEdit: false,
    disableDelete: false,
  }
);

const router = useRouter();

const sortItems = ref([
  { title: "Recently posted", value: ProductSortEnum.TimePostedDesc },
  { title: "Recently updated", value: ProductSortEnum.TimeUpdatedDesc },
  { title: "Name", value: ProductSortEnum.NameAsc },
]);

const sortSelected = ref([sortItems.value[0]]);
const sortItem = computed(() => sortSelected.value[0]);

const nItemsInitialLoad = ref(10);
const first = ref(nItemsInitialLoad.value);

const sort = computed(() => [sortItem.value.value]);

const query = useQueryForProductListQuery({
  variables: {
    typeId: props.productTypeId,
    // @ts-ignore
    sort: sort,
    // @ts-ignore
    first: first,
    after: "",
  },
});

type Query = typeof query;

const productType = computed(() => query.data?.value?.productType);

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.productType?.products?.edges;
  if (!edgesAndNulls) return [];
  return edgesAndNulls.flatMap((e) => (e ? [e] : []));
}
function readNodes(query: Query) {
  return readEdges(query).flatMap((e) => (e.node ? e.node : []));
}

function isEmpty(query: Query) {
  return readNodes(query).length === 0;
}

const queryState = useQueryState(query, { isEmpty });

const {
  loading,
  loaded,
  error,
  empty,
  devtoolState,
  refresh: refresh_,
} = queryState;

const refreshing = ref(false);

const edges = computed(() =>
  refreshing.value || empty.value ? [] : readEdges(query)
);

const nodes = computed(() =>
  refreshing.value || empty.value ? [] : readNodes(query)
);

watch(nodes, async () => {
  collapseCards();
  await loadAllFewRemainingItems();
});

async function loadAllFewRemainingItems() {
  if (
    nodes.value.length + nExtraItemsAutomaticLoad.value >=
    nItemsTotal.value
  ) {
    await loadMore();
  }
}

const nItemsTotal = computed(
  () => productType.value?.products?.totalCount || 0
);

async function refresh() {
  refreshing.value = true;
  first.value = nItemsInitialLoad.value;
  try {
    await refresh_();
  } finally {
    areAllCardsCollapsed.value = true;
    refreshing.value = false;
  }
}

const isCardCollapsed = reactive<{ [key: string]: boolean }>({});

function collapseCards() {
  nodes.value.forEach((node) => {
    const id = node.id;
    if (id in isCardCollapsed) return;
    isCardCollapsed[id] = true;
  });
}
collapseCards();

const areAllCardsCollapsed = computed({
  get: () => Object.values(isCardCollapsed).every((i) => i),
  set: (v) => {
    Object.keys(isCardCollapsed).forEach((k) => {
      isCardCollapsed[k] = v;
    });
  },
});

const deleteDialog = ref(false);

function onDeleteFormCancelled() {
  closeDeleteForm();
}

function onDeleteFormFinished() {
  closeDeleteForm();
  onDeleted();
}

function closeDeleteForm() {
  deleteDialog.value = false;
}

function onDeleted() {
  router.push({ name: "Dashboard" });
}

const loadingMore = ref(false);

// Set temporarily to 0 for the error
// https://actcollaboration.slack.com/archives/C7WJA7X45/p1686667739493689
// Note: The error doesn't occur in local development environment.
// const nExtraItemsAutomaticLoad = ref(2);
const nExtraItemsAutomaticLoad = ref(0);

const showLoadMoreButton = computed(() => {
  // if (loadingMore.value) return false;
  return (
    nItemsTotal.value > nItemsInitialLoad.value + nExtraItemsAutomaticLoad.value
  );
});

const nItemsPerLoad = ref(20);
async function loadMore() {
  if (!productType.value?.products?.pageInfo?.hasNextPage) return;
  first.value = first.value + nItemsPerLoad.value;
}

const store = useStore();
const { nApolloMutations } = storeToRefs(store);
watch(nApolloMutations, refresh);
</script>

<style scoped>
.top-bar {
  display: flex;
  min-block-size: 56px;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 1rem;
}

.bottom-bar {
  display: flex;
  margin-top: 16px;
  min-block-size: 56px;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 1rem;
}
.empty {
  margin-top: 16px;
  display: grid;
  block-size: 100%;
  place-items: center;
  gap: 24px;
}
</style>
