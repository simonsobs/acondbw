<template>
  <v-card class="product-delete-form" style="position: relative">
    <v-card-title v-if="loaded"
      >Delete the {{ node.type_.singular }}</v-card-title
    >
    <v-card-text v-if="error" class="py-2">
      <v-alert type="error" class="my-2">{{ error }}</v-alert>
    </v-card-text>
    <template v-if="loaded">
      <v-card-text class="body-1 font-weight-medium error--text"
        >Really, delete the {{ node.type_.singular }} "{{
          node.name
        }}"?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
        <v-btn color="error" @click="remove">Delete</v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-text v-if="loading" class="pa-4">
        <v-progress-circular
          indeterminate
          :size="18"
          :width="3"
          color="grey"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text
        v-else-if="notFound"
        class="body-1 font-weight-medium text-center pa-4"
        >Not Found</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </template>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-card>
</template>

<script>
import PRODUCT from "@/graphql/queries/Product.gql";
import DELETE_PRODUCT from "@/graphql/mutations/DeleteProduct.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductDeleteForm",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productId: [String, Number], // product.productId not product.id
  },
  data() {
    return {
      init: true,
      node: null,
      error: null,
      devtoolState: null,
      State: State,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.$apollo.queries.node.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.node) {
        return State.LOADED;
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
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
  },
  apollo: {
    node: {
      query: PRODUCT,
      variables() {
        return {
          productId: this.productId,
        };
      },
      update: (data) => data.product,
      result(result) {
        this.init = false;
        this.error = result.error ? result.error : null;
      },
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
      this.delayedReset();
    },
    delayedReset() {
      // reset 0.5 sec after so that the reset form won't be shown.
      setTimeout(() => {
        this.reset();
      }, 500);
    },
    reset() {
      this.error = null;
    },
    async remove() {
      try {
        const data = await this.$apollo.mutate({
          mutation: DELETE_PRODUCT,
          variables: { productId: this.node.productId },
          update: (cache, { data: { deleteProduct } }) => {
            try {
              // Delete all cache and dispacth "apolloMutationCalled", which triggers refetch
              this.$apollo.provider.defaultClient.cache.data.data = {};

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
          },
        });
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Deleted");
        this.$emit("finished");
        this.delayedReset();
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>
