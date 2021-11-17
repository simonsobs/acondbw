<template>
  <v-container
    :fill-height="notFound"
    class="product-add"
    style="position: relative"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="18"
      :width="3"
      color="secondary"
    ></v-progress-circular>
    <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
    <product-add-form
      v-else-if="on && loaded"
      :productTypeId="node ? node.typeId : null"
      @finished="finished"
    ></product-add-form>
    <v-row v-else-if="notFound" align="center" justify="center">
      <v-col class="text-h1 text-center">Not Found (404)</v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script>
import PRODUCT_TYPE_BY_NAME from "@/graphql/queries/ProductTypeByName.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ProductAddForm from "@/components/product/ProductAddForm.vue";

export default {
  name: "ProductAdd",
  components: {
    ProductAddForm,
    DevToolLoadingStateOverridingMenu,
  },
  data: () => ({
    on: true,
    init: true,
    node: null,
    error: null,
    devtoolState: null,
    State: State,
  }),
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.$apollo.loading) return State.LOADING;
      if (this.error) return State.ERROR;
      if (this.node) return State.LOADED;
      if (this.init) return State.INIT;
      return State.NONE;
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
    productTypeName() {
      return this.$route.params.productTypeName;
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
        this.error = result.error || null;
      },
    },
  },
  watch: {
    devtoolState() {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }

      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
  },
  methods: {
    finished() {
      this.$router.push({
        name: "ProductList",
        params: { productTypeName: this.productTypeName },
      });
    },
    onEntered() {
      if (this.init) return;
      Object.values(this.$apollo.queries).forEach((query) => query.refetch());
      this.recreateForm();
    },
    recreateForm() {
      // A component will be reinstantiated
      // when v-if becomes once false and then true.
      this.on = false;
      this.$nextTick(() => {
        this.on = true;
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.onEntered();
    });
  },
};
</script>
