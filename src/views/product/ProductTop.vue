<template>
  <v-container fluid>
    <div class="product-top" style="position: relative;">
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-row class="mx-1 mt-3" style="max-width: 980px;">
        <v-col v-if="state == State.LOADED" col="8" class="display-1 primary--text pa-0 ma-0">
          <span class="me-2">
            <v-icon>{{ node.icon }}</v-icon>
          </span>
          <router-link
            :to="'/' + node.name"
            v-text="node.plural"
            class="capitalize"
            style="text-decoration: none; color: inherit;"
          ></router-link>
          <span v-if="itemName">
            <v-icon large color="primary">mdi-chevron-right</v-icon>
            {{ itemName }}
          </span>
        </v-col>
        <v-col v-else col="8" class="pa-0 ma-0">
          <div v-if="state == State.LOADING" class="mx-4 py-2">
            <v-progress-circular indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
          </div>
          <span v-else-if="state == State.ERROR">Error: cannot load data</span>
          <span v-else></span>
        </v-col>
      </v-row>
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
      <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
    </div>
  </v-container>
</template>

<script>
import WebConfig from "@/graphql/site/WebConfig.gql";
import PRODUCT_TYPE_BY_NAME from "@/graphql/product/ProductTypeByName.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductTop",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  data: () => ({
    productTypeName: null,
    itemName: null,
    node: null,
    error: null,
    devtoolState: null,
    State: State,
    transitionName: "fade-product-top-leave",
    transitionMode: "out-in",
    webConfig: null
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
    },
    disableAdd() {
      return this.webConfig ? !this.webConfig.productCreationDialog : true;
    },
    disableEdit() {
      return this.webConfig ? !this.webConfig.productUpdateDialog : true;
    },
    disableDelete() {
      return this.webConfig ? !this.webConfig.productDeletionDialog : true;
    }
  },
  apollo: {
    webConfig: {
      query: WebConfig
    },
    node: {
      query: PRODUCT_TYPE_BY_NAME,
      variables() {
        return { name: this.productTypeName };
      },
      update: data => data.productType,
      skip() {
        return !this.productTypeName;
      },
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
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
  }
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
