<template>
  <product-add-form
    :productTypeId="node ? node.typeId : null"
    v-on:finished="finished"
  ></product-add-form>
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