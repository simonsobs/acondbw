<template>
  <v-container class="product-item" style="position: relative">
    <v-row>
      <v-col class="pb-0">
        <v-card-actions class="align-end" style="height: 56px">
          <v-tooltip v-if="node" bottom open-delay="800">
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
      <v-col v-else-if="loaded" class="pt-0">
        <component
          :is="productItemCard"
          :productId="node.productId"
          :collapsible="false"
          @deleted="onDeleted"
          @nameChanged="onNameChanged($event)"
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

<script>
import PRODUCT_BY_TYPE_ID_AND_NAME from "@/graphql/queries/ProductByTypeIdAndName.gql";

import ProductItemCard from "@/components/product/ProductItemCard.vue";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default {
  name: "ProductItem",
  components: {
    ProductItemCard,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productTypeId: { required: true },
    productItemCard: { default: "ProductItemCard" },
    disableEdit: { default: false },
    disableDelete: { default: false },
  },
  data() {
    return {
      productTypeName: null,
      init: true,
      node: null,
      name: null,
      error: null,
      refreshing: false,
      devtoolState: null,
      State: State,
    };
  },
  mounted() {
    this.name = this.$route.params.name;
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
    node: function () {
      if (this.node && this.node.type_) {
        this.productTypeName = this.node.type_.name;
      }
    },
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.refreshing) {
        return State.LOADING;
      }

      if (this.node) {
        return State.LOADED;
      } else if (this.$apollo.queries.node.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.init) {
        return State.INIT;
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
    notFound() {
      return this.state == State.NONE;
    },
  },
  apollo: {
    node: {
      query: PRODUCT_BY_TYPE_ID_AND_NAME,
      variables() {
        return {
          typeId: this.productTypeId,
          name: this.name,
        };
      },
      skip: function () {
        return !(this.productTypeId && this.name);
      },
      update: function (data) {
        return data.product;
      },
      result(result) {
        this.init = false;
        this.error = result.error ? result.error : null;
      },
    },
  },
  methods: {
    onDeleted() {
      this.$router.push({
        name: "ProductList",
        params: { productTypeName: this.productTypeName },
      });
    },
    onNameChanged(event) {
      this.$router.push({
        name: "ProductItem",
        params: {
          productTypeName: this.node.type_.name,
          name: event,
        },
      });
    },
    async refresh() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await this.$apollo.queries.node.refetch();
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
  },
};
</script>
