<template>
  <v-container
    fluid
    :fill-height="notFound"
    class="product-add"
    style="position: relative"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="18"
      :width="3"
      color="grey"
    ></v-progress-circular>
    <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
    <product-add-form
      v-else-if="loaded"
      :productTypeId="node ? node.typeId : null"
      v-on:finished="finished"
    ></product-add-form>
    <v-row v-else-if="notFound" align="center" justify="center">
      <v-col class="text-h1 text-center">Not Found (404)</v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script>
import PRODUCT_TYPE_BY_NAME from "@/graphql/queries/ProductTypeByName.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

import ProductAddForm from "@/components/product/ProductAddForm";

export default {
  name: "ProductAdd",
  components: {
    ProductAddForm,
    DevToolLoadingStateOverridingMenu,
  },
  data: () => ({
    productTypeName: null,
    init: true,
    node: null,
    error: null,
    devtoolState: null,
    State: State,
  }),
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
      query: PRODUCT_TYPE_BY_NAME,
      variables() {
        return { name: this.productTypeName };
      },
      update: (data) => data.productType,
      skip() {
        return !this.productTypeName;
      },
      result(result) {
        this.init = false;
        this.error = result.error ? result.error : null;
      },
    },
  },
  mounted() {
    this.productTypeName = this.$route.params.productTypeName;
  },
  methods: {
    finished() {
      this.$router.push({
        name: "ProductList",
        params: { productTypeName: this.productTypeName },
      });
    },
  },
};
</script>