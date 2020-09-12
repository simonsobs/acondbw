<template>
  <div class="product-delete-form" style="position: relative;">
    <v-card class="pa-3">
      <v-card-title
        v-if="state == State.LOADED"
        class="headline"
      >Delete the {{ node.type_.singular }}</v-card-title>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <div v-if="state == State.LOADED">
        <v-card-text
          class="body-1 font-weight-medium error--text"
        >Really, delete the {{ node.type_.singular}} "{{ node.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
          <v-btn color="error" @click="deleteProduct()">Delete</v-btn>
        </v-card-actions>
      </div>
      <div v-else>
        <div v-if="state == State.LOADING" class="mx-4 py-2">
          <v-progress-circular indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
        </div>
        <v-card-text v-else-if="state == State.ERROR">Error: cannot load data</v-card-text>
        <v-card-text v-else>Nothing to show here.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import gql from "graphql-tag";
import PRODUCT from "@/graphql/Product.gql";
import DELETE_PRODUCT from "@/graphql/DeleteProduct.gql";
import ALL_PRODUCTS_BY_TYPE_ID from "@/graphql/AllProductsByTypeId.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductDeleteForm",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productId: { default: null } // product.productId not product.id
  },
  data() {
    return {
      node: null,
      error: null,
      devtoolState: null,
      State: State
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.node) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.node.loading;
    }
  },
  apollo: {
    node: {
      query: PRODUCT,
      variables() {
        return {
          productId: this.productId
        };
      },
      update: data => data.product,
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  methods: {
    async deleteProduct() {
      try {
        const data = await this.$apollo.mutate({
          mutation: DELETE_PRODUCT,
          variables: { productId: this.node.productId },
          update: (cache, { data: { deleteProduct } }) => {
            try {
              // Delete all cache and dispacth "apolloMutationCalled", which triggers refetch
              this.$apollo.provider.defaultClient.cache.data.data = {}

              // The following code was used to update cache, which 
              // is typically a recommended way. But it is commented out
              // because it is not clear how to systematically update 
              // all affected cache.

              // this.$apollo.provider.defaultClient.cache.data.data = {};
              // const data = cache.readQuery({
              //   query: ALL_PRODUCTS_BY_TYPE_ID,
              //   variables: { typeId: this.node.type_.typeId }
              // });
              // const index = data.allProducts.edges.findIndex(
              //   e => e.node.productId == this.node.productId
              // );
              // data.allProducts.edges.splice(index, 1);
              // cache.writeQuery({
              //   query: ALL_PRODUCTS_BY_TYPE_ID,
              //   variables: { typeId: this.node.type_.typeId },
              //   data
              // });
            } catch (error) {}
          }
        });
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Deleted");
        this.$emit("deleted");
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>
