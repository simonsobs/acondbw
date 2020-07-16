<template>
  <div class="navigation" style="position: relative;">
    <div v-if="state == State.LOADED">
      <v-list shaped>
        <v-list-item
          link
          router
          v-for="edge in edges"
          :key="edge.node.typeId"
          :to="'/' + edge.node.name"
        >
          <v-list-item-action>
            <v-icon v-text="edge.node.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="edge.node.plural" class="capitalize"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <v-alert
      v-else-if="state == State.EMPTY"
      outlined
      dense
      type="info"
      class="ma-2"
    >No product types are defined.</v-alert>
    <div v-else-if="state == State.LOADING" class="mx-2 pt-5">
      <v-progress-circular indeterminate :size="26" color="grey"></v-progress-circular>
    </div>
    <v-alert v-else-if="state == State.ERROR" outlined dense type="error" class="ma-2">{{ error }}</v-alert>
    <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import ALL_PRODUCTS_TYPES from "@/graphql/AllProductTypes.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "Navigation",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  data: () => ({
    edges: null,
    error: null,
    devtoolState: null,
    State: State
  }),
  apollo: {
    edges: {
      query: ALL_PRODUCTS_TYPES,
      update: data =>
        data.allProductTypes ? data.allProductTypes.edges : null,
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
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
      } else if (this.edges) {
        if (this.edges.length) {
          return State.LOADED;
        } else {
          return State.EMPTY;
        }
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.edges.loading;
    }
  }
};
</script>
