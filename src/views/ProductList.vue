<template>
  <div class="product-list" style="position: relative;">
    <div v-if="state == State.LOADED || state == State.EMPTY">
      <v-container fluid class="pa-0">
        <v-row
          align="center"
          justify="space-between"
          class="ma-0 px-0 pt-3 pb-1"
          style="max-width: 980px;"
        >
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                @click="$apollo.queries.productType.refetch(); areAllCardsCollapsed = true"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <div>
            <span v-if="state == State.LOADED" class="secondary--text">
              <span v-if="productType.products.totalCount == 1">1 {{ productType.singular }}</span>
              <span v-else>{{ productType.products.totalCount }} {{ productType.plural }}</span>
            </span>
          </div>
          <div v-if="state == State.LOADED">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ on: tooltip }">
                <v-menu left offset-y>
                  <template v-slot:activator="{ on: menu }">
                    <v-btn icon v-on="{ ...tooltip, ...menu}">
                      <v-icon>mdi-sort-variant</v-icon>
                    </v-btn>
                  </template>
                  <v-list flat dense>
                    <v-subheader>Sort</v-subheader>
                    <v-list-item-group v-model="sortItem" color="primary">
                      <v-list-item v-for="(item, i) in sortItems" :key="i">
                        <v-list-item-icon>
                          <v-icon v-if="i == sortItem">mdi-check</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </template>
              <span>Sort</span>
            </v-tooltip>
          </div>
          <div>
            <span v-if="state == State.LOADED">
              <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{ on }">
                  <v-btn icon @click="areAllCardsCollapsed = !areAllCardsCollapsed" v-on="on">
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
                  {{
                  areAllCardsCollapsed ? "Expand all" : "Collapse all"
                  }}
                </span>
              </v-tooltip>
            </span>
            <v-dialog v-model="dialog" persistent fullscreen transition="dialog-bottom-transition">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn :disabled="disableAdd" icon v-on="{ ...tooltip, ...dialog }">
                      <v-icon>mdi-plus-thick</v-icon>
                    </v-btn>
                  </template>
                  <span>Add {{ productType.indefArticle }} {{ productType.singular }}</span>
                </v-tooltip>
              </template>
              <v-card>
                <v-app-bar dense color="secondary" style="position: sticky; top: 0; z-index: 999;">
                  <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-app-bar>
                <component
                  :is="productAddForm"
                  :productTypeId="productType.typeId"
                  v-on:finished="dialog = false"
                ></component>
              </v-card>
            </v-dialog>
          </div>
        </v-row>
      </v-container>
      <div v-if="state == State.LOADED">
        <transition-group name="fade" tag="div" class="list-group">
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
        </transition-group>
      </div>
      <div v-else>
        <v-card outlined style="max-width: 980px;">
          <v-card-text>Empty. No {{ productType.plural }} are found.</v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else-if="state == State.LOADING" class="mx-2 pt-5">
      <v-progress-circular indeterminate :size="26" color="grey"></v-progress-circular>
    </div>
    <div v-else-if="state == State.ERROR" class="mx-2 pt-5">
      <v-alert
        v-if="queryProductTypeError"
        type="error"
        style="max-width: 980px;"
      >{{ queryProductTypeError }}</v-alert>
      <v-alert v-if="error" type="error" style="max-width: 980px;">{{ error }}</v-alert>
    </div>
    <div v-else class="mx-2 pt-5">
      <!-- state = State.NONE -->
    </div>
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
  </div>
</template>

<script>
require("vue2-animate/dist/vue2-animate.min.css");

import ProductItemCard from "@/components/ProductItemCard";
import ProductAddForm from "@/components/ProductAddForm";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

import QueryForProductList from "@/graphql/QueryForProductList.gql";
import ALL_PRODUCTS_BY_TYPE_ID from "@/graphql/AllProductsByTypeId.gql";

export default {
  name: "ProductList",
  components: {
    ProductItemCard,
    ProductAddForm,
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productTypeId: { required: true },
    productItemCard: { default: "ProductItemCard" },
    productAddForm: { default: "ProductAddForm" },
    disableAdd: { default: false },
    disableEdit: { default: false },
    disableDelete: { default: false }
  },
  data() {
    return {
      productType: null,
      dialog: false,
      error: null,
      sortItem: 0,
      sortItems: [
        { text: "Recently produced", value: "DATE_PRODUCED_DESC" },
        { text: "Recently posted", value: "DATE_POSTED_DESC" },
        { text: "Recently updated", value: "DATE_UPDATED_DESC" },
        { text: "Name", value: "NAME_ASC" }
      ],
      isCardCollapsed: {},
      devtoolState: null,
      State: State
    };
  },
  apollo: {
    productType: {
      query: QueryForProductList,
      variables() {
        return { typeId: this.productTypeId, sort: [this.sort] };
      },
      skip: function() {
        return !this.productTypeId || !this.sort;
      },
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
  },
  computed: {
    edges() {
      return this.productType ? this.productType.products.edges : null;
    },
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.edges) {
        if (this.edges.length) {
          return State.LOADED;
        } else {
          return State.EMPTY;
        }
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.productType.loading;
    },
    sort() {
      return this.sortItems[this.sortItem].value;
    },
    areAllCardsCollapsed: {
      get: function() {
        return Object.keys(this.isCardCollapsed).every(
          i => this.isCardCollapsed[i]
        );
      },
      set: function(v) {
        for (const k in this.isCardCollapsed) {
          this.isCardCollapsed[k] = v;
        }
      }
    }
  },
  watch: {
    devtoolState: function() {
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
    "$store.state.nApolloMutations": function() {
      this.$apollo.queries.productType.refetch();
    },
    edges: function() {
      if (this.edges == undefined) {
        return;
      }
      for (const edge of this.edges) {
        const id = edge.node.id;
        if (!(id in this.isCardCollapsed)) {
          this.isCardCollapsed = {
            ...this.isCardCollapsed,
            [id]: true
          };
          // The above line of the code adds a new element {id: true} to
          // the object this.isCardCollapsed in the way that the new
          // element will be a reactive object of Vue. The commented out
          // code below is simpler but the new element won't be reactive.
          // this.isCardCollapsed[id] = true;
        }
      }
    }
  }
};
</script>
