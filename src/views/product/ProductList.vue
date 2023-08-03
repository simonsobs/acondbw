<template>
  <v-container class="product-list" style="position: relative">
    <v-row v-if="error">
      <v-col>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-0">
        <v-card-actions class="align-end" style="height: 56px">
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ props }">
              <v-btn :disabled="loading" icon @click="refresh()" v-bind="props">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <span v-if="loaded && productType" class="secondary--text">
            <span v-if="nItemsTotal == 1">1 {{ productType.singular }}</span>
            <span v-else>{{ nItemsTotal }} {{ productType.plural }}</span>
          </span>
          <v-spacer></v-spacer>
          <span v-if="loaded && nItemsTotal > 1">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ props: tooltip }">
                <v-menu left offset-y>
                  <template v-slot:activator="{ props: menu }">
                    <v-btn icon v-bind="{ ...tooltip, ...menu }">
                      <v-icon>mdi-sort-variant</v-icon>
                    </v-btn>
                  </template>
                  <v-list flat dense>
                    <v-list-item title="Sort"> </v-list-item>
                    <!-- <v-list-item-group v-model="sortItem" color="primary"> -->
                    <v-list-item
                      v-for="(item, i) in sortItems"
                      :key="i"
                      :title="item.text"
                    >
                      <template v-slot:prepend>
                        <v-icon v-if="i == sortItem" icon="mdi-check"> </v-icon>
                        <v-icon v-else> </v-icon>
                      </template>
                    </v-list-item>
                    <!-- </v-list-item-group> -->
                  </v-list>
                </v-menu>
              </template>
              <span>Sort</span>
            </v-tooltip>
          </span>
          <v-spacer></v-spacer>
          <span v-if="loaded">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  @click="areAllCardsCollapsed = !areAllCardsCollapsed"
                  v-bind="props"
                >
                  <v-icon>
                    {{
                      areAllCardsCollapsed
                        ? "mdi-unfold-more-horizontal"
                        : "mdi-unfold-less-horizontal"
                    }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ areAllCardsCollapsed ? "Expand all" : "Collapse all" }}
              </span>
            </v-tooltip>
          </span>
          <span v-if="loaded || empty">
            <v-btn
              :disabled="disableAdd"
              fab
              class="ml-3 secondary"
              :to="{
                name: 'ProductAdd',
                params: { productTypeName: productType.name },
              }"
              v-if="productType"
            >
              <v-icon class="on-secondary--text">mdi-plus-thick</v-icon>
            </v-btn>
          </span>
        </v-card-actions>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="nodes.length" class="pt-0 pb-16">
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
        <v-card-actions v-if="showLoadMoreButton && productType">
          <v-spacer></v-spacer>
          <span v-if="nItemsTotal > 1">
            <span v-if="nodes.length == nItemsTotal">
              {{ nItemsTotal }} {{ productType.plural }}
            </span>
            <span v-else>
              {{ edges.length }} of {{ nItemsTotal }}
              {{ productType.plural }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="productType && productType.products"
            :disabled="!productType.products.pageInfo.hasNextPage"
            outlined
            color="secondary"
            text
            @click="loadMore()"
          >
            Load more
          </v-btn>
        </v-card-actions>
      </v-col>
      <v-col v-else-if="loading">
        <div class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
      </v-col>
      <v-col v-else-if="empty && productType">
        <v-card-text>
          Empty. No {{ productType.plural }} are found.
        </v-card-text>
        <v-card-actions>
          <v-btn
            depressed
            variant="flat"
            :to="{
              name: 'ProductAdd',
              params: { productTypeName: productType.name },
            }"
          >
            <v-icon left> mdi-plus-thick </v-icon> Add the first entry
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-dialog v-model="deleteDialog" max-width="600">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                color="secondary"
                :disabled="disableDelete"
              >
                <v-icon left> mdi-delete </v-icon>
                Delete the product type
              </v-btn>
            </template>
            <product-type-delete-form
              v-if="deleteDialog"
              :node="productType"
              @cancel="onDeleteFormCancelled"
              @finished="onDeleteFormFinished"
            ></product-type-delete-form>
          </v-dialog>
        </v-card-actions>
      </v-col>
    </v-row>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed, withDefaults } from "vue";
import { useRouter } from "vue-router";

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

const sortItem = ref(0);

const sortItems = ref([
  { text: "Recently posted", value: ProductSortEnum.TimePostedDesc },
  { text: "Recently updated", value: ProductSortEnum.TimeUpdatedDesc },
  { text: "Name", value: ProductSortEnum.NameAsc },
]);

const nItemsInitialLoad = ref(10);
const first = ref(nItemsInitialLoad.value);

const sort = computed(() => [sortItems.value[sortItem.value].value]);

const query = useQueryForProductListQuery({
  variables: {
    typeId: props.productTypeId,
    sort: sort,
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

const isCardCollapsed = ref<{ [key: string]: boolean }>({});

function collapseCards() {
  nodes.value.forEach((node) => {
    const id = node.id;
    if (id in isCardCollapsed.value) return;
    isCardCollapsed.value = { ...isCardCollapsed.value, [id]: true };
  });
}

const areAllCardsCollapsed = computed({
  get: () => Object.values(isCardCollapsed.value).every((i) => i),
  set: (v) => {
    Object.keys(isCardCollapsed.value).forEach((k) => {
      isCardCollapsed.value[k] = v;
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
</script>
