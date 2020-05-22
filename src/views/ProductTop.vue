<template>
  <div class="product-top" style="position: relative;">
    <v-container fluid>
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
          <span v-if="itemPage">
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
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-container>
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
  </div>
</template>

<script>
import PRODUCT_TYPE_BY_NAME from "@/graphql/ProductTypeByName.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductTop",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productTypeName: { required: true },
    itemPageName: { default: "ProductItemPageName" }
  },
  data: () => ({
    node: null,
    error: null,
    devtoolState: null,
    State: State,
    transitionName: "fade-product-top-leave",
    transitionMode: "out-in"
  }),
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
    itemPage() {
      return this.$route.name == this.itemPageName;
    },
    itemName() {
      return this.$route.params.name;
    }
  },
  apollo: {
    node: {
      query: PRODUCT_TYPE_BY_NAME,
      variables() {
        return {
          name: this.productTypeName
        };
      },
      update: data => data.productType,
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
