<template>
  <div class="product-delete-form" style="position: relative;">
    <v-card class="pa-3">
      <v-card-title class="headline">Delete the {{ productTypeNameSingular }}</v-card-title>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <div v-if="state == State.LOADED">
        <v-card-text
          class="body-1 font-weight-medium error--text"
        >Really, delete the {{ productTypeNameSingular}} "{{ node.name }}"?</v-card-text>
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
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="success--text">Deleted</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialogSuccess()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
  </div>
</template>

<script>
import gql from "graphql-tag";
import PRODUCT from "@/graphql/Product.gql";
import ALL_PRODUCTS_BY_TYPE_ID from "@/graphql/AllProductsByTypeId.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

const PRODUCT_FOR_DELETE = gql`
  query ProductForDelete($productId: Int!) {
    product(productId: $productId) {
      id
      productId
      typeId
      name
    }
  }
`;

export default {
  name: "ProductDeleteForm",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productTypeNameSingular: { default: "product" },
    productTypeNamePlural: { default: "products" },
    productId: { default: null } // product.productId not product.id
  },
  data() {
    return {
      node: null,
      error: null,
      dialogSuccess: false,
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
      query: PRODUCT_FOR_DELETE,
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
          mutation: gql`
            mutation($productId: Int!) {
              deleteProduct(productId: $productId) {
                ok
              }
            }
          `,
          variables: {
            productId: this.node.productId
          },
          update: (cache, { data: { deleteProduct } }) => {
            const data = cache.readQuery({
              query: ALL_PRODUCTS_BY_TYPE_ID,
              variables: { typeId: this.node.typeId }
            });
            const index = data.allProducts.edges.findIndex(
              e => e.node.productId == this.node.productId
            );
            data.allProducts.edges.splice(index, 1);
            cache.writeQuery({
              query: ALL_PRODUCTS_BY_TYPE_ID,
              variables: { typeId: this.node.typeId },
              data
            });
          }
        });
        this.dialogSuccess = true;
      } catch (error) {
        this.error = error;
      }
    },
    closeDialogSuccess() {
      this.dialogSuccess = false;
      this.$emit("finished");
      this.$emit("deleted");
    }
  }
};
</script>
