<template>
  <v-container
    :fill-height="notFound"
    class="product-top"
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
    <v-row v-if="loaded" class="mx-1 mt-3">
      <v-col col="8" class="text-h4 primary--text pa-0 ma-0">
        <span class="me-2">
          <v-icon>{{ node.icon }}</v-icon>
        </span>
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
      </v-col>
    </v-row>
    <template v-if="loaded">
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
    </template>
    <v-row v-if="notFound" align="center" justify="center">
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
        this.error = result.error ? result.error : null;
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
