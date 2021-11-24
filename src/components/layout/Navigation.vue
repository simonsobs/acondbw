<template>
  <div class="navigation">
    <v-list v-if="loaded" shaped>
      <v-list-item
        link
        router
        v-for="edge in edges"
        :key="edge.node.typeId"
        :to="{
          name: 'ProductList',
          params: { productTypeName: edge.node.name },
        }"
      >
        <v-list-item-action class="mr-5">
          <v-icon v-text="edge.node.icon"></v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            v-text="edge.node.plural"
            class="capitalize condensed-font font-weight-medium"
          ></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon class="ml-2">
          <v-chip
            small
            v-if="!!edge.node.products.totalCount"
            v-text="edge.node.products.totalCount"
          ></v-chip>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-alert v-else-if="empty" outlined dense type="info" class="ma-2">
      No product types are defined.
    </v-alert>
    <v-progress-circular
      v-else-if="loading"
      indeterminate
      :size="18"
      :width="3"
      color="secondary"
      class="mx-5 mt-5"
    ></v-progress-circular>
    <v-alert v-else-if="error" outlined dense type="error" class="ma-2">
      {{ error }}
    </v-alert>
    <v-bottom-navigation absolute class="px-3 justify-start align-center">
      <span class="grey--text text-caption">
        v{{ $store.getters.appVersion }}
      </span>
      <!-- <v-spacer></v-spacer>
      <v-icon>mdi-plus-thick</v-icon> -->
    </v-bottom-navigation>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default {
  name: "Navigation",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  data: () => ({
    init: true,
    edges: null,
    error: null,
    devtoolState: null,
    State: State,
  }),
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.$apollo.loading) return State.LOADING;
      if (this.error) return State.ERROR;
      if (this.edges) {
        if (this.edges.length) return State.LOADED;
        return State.EMPTY;
      }
      if (this.init) return State.INIT;
      return State.NONE;
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    empty() {
      return this.state == State.EMPTY;
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
    "$store.state.nApolloMutations": function () {
      this.$apollo.queries.edges.refetch();
    },
  },
  apollo: {
    edges: {
      query: ALL_PRODUCT_TYPES,
      update: (data) =>
        data.allProductTypes ? data.allProductTypes.edges : null,
      result(result) {
        this.init = false;
        this.error = result.error || null;
      },
    },
  },
};
</script>
