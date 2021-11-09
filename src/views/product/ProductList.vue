<template>
  <v-container class="product-list" style="position: relative">
    <v-row>
      <v-col class="pb-0">
        <v-card-actions class="align-end" style="height: 56px">
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn :disabled="loading" icon @click="refresh()" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <span v-if="loaded" class="secondary--text">
            <span v-if="nItemsTotal == 1">1 {{ productType.singular }}</span>
            <span v-else>{{ nItemsTotal }} {{ productType.plural }}</span>
          </span>
          <v-spacer></v-spacer>
          <span v-if="loaded && nItemsTotal > 1">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ on: tooltip }">
                <v-menu left offset-y>
                  <template v-slot:activator="{ on: menu }">
                    <v-btn icon v-on="{ ...tooltip, ...menu }">
                      <v-icon>mdi-sort-variant</v-icon>
                    </v-btn>
                  </template>
                  <v-list flat dense>
                    <v-list-item>
                      <v-list-item-title>Sort</v-list-item-title>
                    </v-list-item>
                    <v-list-item-group v-model="sortItem" color="primary">
                      <v-list-item v-for="(item, i) in sortItems" :key="i">
                        <v-list-item-icon>
                          <v-icon v-if="i == sortItem">mdi-check</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.text"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </template>
              <span>Sort</span>
            </v-tooltip>
          </span>
          <v-spacer></v-spacer>
          <span v-if="loaded">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  @click="areAllCardsCollapsed = !areAllCardsCollapsed"
                  v-on="on"
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
            >
              <v-icon class="on-secondary--text">mdi-plus-thick</v-icon>
            </v-btn>
          </span>
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
      <v-col v-if="loaded" class="pt-0 pb-16">
        <component
          :is="productItemCard"
          v-for="edge in edges"
          :key="edge.node.id"
          :productId="edge.node.productId"
          collapsible="true"
          :collapsed="isCardCollapsed[edge.node.id]"
          v-on:expand="isCardCollapsed[edge.node.id] = false"
          v-on:collapse="isCardCollapsed[edge.node.id] = true"
          :disableEdit="disableEdit"
          :disableDelete="disableDelete"
          class="my-1"
        ></component>
        <div v-if="loadingMore" class="pa-3">
          <v-progress-circular
            indeterminate
            :size="26"
            color="secondary"
          ></v-progress-circular>
        </div>
        <v-card-actions v-if="showLoadMoreButton">
          <v-spacer></v-spacer>
          <span v-if="nItemsTotal > 1">
            <span v-if="edges.length == nItemsTotal">
              {{ nItemsTotal }} {{ productType.plural }}
            </span>
            <span v-else>
              {{ edges.length }} of {{ nItemsTotal }}
              {{ productType.plural }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-btn
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
      <v-col v-else-if="empty">
        <v-card-text>
          Empty. No {{ productType.plural }} are found.
        </v-card-text>
      </v-col>
      <v-col v-else-if="error">
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-col>
      <v-col v-else>
        <!-- state = State.NONE -->
      </v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script>
import ProductItemCard from "@/components/product/ProductItemCard.vue";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import QueryForProductList from "@/graphql/queries/QueryForProductList.gql";

export default {
  name: "ProductList",
  components: {
    ProductItemCard,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productTypeId: { required: true },
    productItemCard: { default: "ProductItemCard" },
    productAddForm: { default: "ProductAddForm" },
    disableAdd: { default: false },
    disableEdit: { default: false },
    disableDelete: { default: false },
  },
  data() {
    return {
      productType: null,
      init: true,
      error: null,
      refreshing: false,
      loadingMore: false,
      sortItem: 0,
      sortItems: [
        { text: "Recently produced", value: "DATE_PRODUCED_DESC" },
        { text: "Recently posted", value: "DATE_POSTED_DESC" },
        { text: "Recently updated", value: "DATE_UPDATED_DESC" },
        { text: "Name", value: "NAME_ASC" },
      ],
      nItemsInitialLoad: 10,
      nEtraItemsAutomaticLoad: 2,
      nItemsPerLoad: 20,
      isCardCollapsed: {},
      devtoolState: null,
      State: State,
    };
  },
  apollo: {
    productType: {
      query: QueryForProductList,
      variables() {
        return {
          typeId: this.productTypeId,
          sort: [this.sort],
          first: this.nItemsInitialLoad,
          after: "",
        };
      },
      skip: function () {
        return !this.productTypeId || !this.sort;
      },
      result(result) {
        this.init = false;
        this.error = result.error ? result.error : null;
      },
    },
  },
  computed: {
    edges() {
      return this.productType ? this.productType.products.edges : null;
    },
    nItemsTotal() {
      return this.productType ? this.productType.products.totalCount : null;
    },
    showLoadMoreButton() {
      if (this.loadingMore) {
        return false;
      }
      return (
        this.nItemsTotal > this.nItemsInitialLoad + this.nEtraItemsAutomaticLoad
      );
    },
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.refreshing) {
        return State.LOADING;
      }

      if (this.edges) {
        if (this.edges.length) {
          return State.LOADED;
        } else {
          return State.EMPTY;
        }
      } else if (this.$apollo.queries.productType.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    empty() {
      return this.state == State.EMPTY;
    },
    notFound() {
      return this.state == State.NONE;
    },
    sort() {
      return this.sortItems[this.sortItem].value;
    },
    areAllCardsCollapsed: {
      get: function () {
        return Object.keys(this.isCardCollapsed).every(
          (i) => this.isCardCollapsed[i]
        );
      },
      set: function (v) {
        for (const k in this.isCardCollapsed) {
          this.isCardCollapsed[k] = v;
        }
      },
    },
  },
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
    "$store.state.nApolloMutations": function () {
      this.refresh();
    },
    edges: function () {
      this.collapseCards();
      this.loadAllFewRemainingItems();
    },
  },
  methods: {
    collapseCards() {
      if (this.edges == undefined) {
        return;
      }
      for (const edge of this.edges) {
        const id = edge.node.id;
        if (!(id in this.isCardCollapsed)) {
          this.isCardCollapsed = {
            ...this.isCardCollapsed,
            [id]: true,
          };
          // The above line of the code adds a new element {id: true} to
          // the object this.isCardCollapsed in the way that the new
          // element will be a reactive object of Vue. The commented out
          // code below is simpler but the new element won't be reactive.
          // this.isCardCollapsed[id] = true;
        }
      }
    },
    loadAllFewRemainingItems() {
      if (this.edges == undefined) {
        return;
      }
      if (
        this.edges.length + this.nEtraItemsAutomaticLoad >=
        this.nItemsTotal
      ) {
        this.loadMore();
      }
    },
    async refresh() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await this.$apollo.queries.productType.refetch();
      this.areAllCardsCollapsed = true;
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
    async loadMore() {
      if (!this.productType.products.pageInfo.hasNextPage) {
        return;
      }

      this.loadingMore = true;
      try {
        await this.$apollo.queries.productType.fetchMore({
          variables: {
            first: this.nItemsPerLoad,
            after: this.productType.products.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              productType: {
                ...previousResult.productType,
                products: {
                  ...previousResult.productType.products,
                  pageInfo: {
                    ...previousResult.productType.products.pageInfo,
                    endCursor:
                      fetchMoreResult.productType.products.pageInfo.endCursor,
                    hasNextPage:
                      fetchMoreResult.productType.products.pageInfo.hasNextPage,
                  },
                  edges: [
                    ...previousResult.productType.products.edges,
                    ...fetchMoreResult.productType.products.edges,
                  ],
                },
              },
            };
          },
        });
      } catch (error) {}
      this.loadingMore = false;
    },
  },
};
</script>
