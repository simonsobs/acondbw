<template>
  <v-container
    :fill-height="notFound"
    class="product-top"
    style="position: relative"
  >
    <v-row v-if="notFound" align="center" justify="center">
      <v-col class="text-h1 text-center">Not Found (404)</v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-progress-circular
          v-if="loading"
          indeterminate
          :size="18"
          :width="3"
          color="secondary"
        ></v-progress-circular>
        <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
        <v-card flat v-if="loaded">
          <v-card-title class="text-h4 primary--text">
            <v-icon large class="me-3" v-text="node.icon"></v-icon>
            <router-link
              :to="{
                name: 'ProductList',
                params: { productTypeName: node.name },
              }"
              v-text="node.plural"
              class="capitalize"
              style="text-decoration: none; color: inherit"
            ></router-link>
            <span v-if="itemName">
              <v-icon large color="primary">mdi-chevron-right</v-icon>
              {{ itemName }}
            </span>
          </v-card-title>
          <transition :name="transitionName" :mode="transitionMode">
            <keep-alive>
              <router-view
                :key="$route.fullPath"
                :productTypeId="node ? node.typeId : null"
                :disableAdd="disableAdd"
                :disableEdit="disableEdit"
                :disableDelete="disableDelete"
              ></router-view>
            </keep-alive>
          </transition>
        </v-card>
      </v-col>
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

export default {
  name: "ProductTop",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  data: () => ({
    productTypeName: null,
    itemName: null,
    init: true,
    node: null,
    error: null,
    devtoolState: null,
    State: State,
    transitionName: "fade-product-top-leave",
    transitionMode: "out-in",
  }),
  mounted() {
    this.productTypeName = this.$route.params.productTypeName;
    this.itemName = this.$route.params.name;
  },
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
    disableAdd() {
      return !this.$store.state.webConfig.productCreationDialog;
    },
    disableEdit() {
      return !this.$store.state.webConfig.productUpdateDialog;
    },
    disableDelete() {
      return !this.$store.state.webConfig.productDeletionDialog;
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
        this.error = result.error || null;
      },
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.transitionName = "fade-product-top-update";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-product-top-leave";
    this.transitionMode = "out-in";
    next();
  },
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.fade-product-top-update-enter-active {
  transition: opacity 0.8s;
}

.fade-product-top-update-leave-active {
  transition: opacity 0s;
}

.fade-product-top-update-enter,
.fade-product-top-update-leave-to {
  opacity: 0;
}

.fade-product-top-leave-enter-active {
  transition: opacity 0s;
}

.fade-product-top-leave-leave-active {
  transition: opacity 0s;
}

.fade-product-top-leave-enter {
  opacity: 1;
}

.fade-product-top-leave-leave-to {
  opacity: 1;
}
</style>
