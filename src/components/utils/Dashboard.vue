<template>
  <div class="dashboard" style="position: relative;">
    <v-data-table
      v-if="items"
      :headers="headers"
      :items="items"
      :loading="state == State.LOADING"
      disable-sort
      hide-default-footer
      @click:row="clickRow"
      class="elevation-1"
    >
      <template v-slot:item.plural="{ item }">
        <router-link :to="{ name: 'ProductList', params: { productTypeName: item.name } }">
          <span class="capitalize font-weight-bold primary--text">{{ item.plural }}</span>
        </router-link>
      </template>
    </v-data-table>
    <v-alert v-if="error" type="error" style="width: 100%;">{{ error }}</v-alert>
    <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import ALL_PRODUCTS_TYPES from "@/graphql/AllProductTypes.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "Dashboard",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  data: () => ({
    edges: null,
    headers: [
      { text: "Product type", value: "plural" },
      { text: "Number of products", align: "end", value: "products.totalCount" }
    ],
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
    },
    items() {
      if (this.state == State.NONE) {
        return null;
      } else if (this.state == State.EMPTY) {
        return [];
      } else {
        return this.edges ? this.edges.map(edge => edge.node) : null;
      }
    }
  },
  methods: {
    clickRow(item) {
      this.$router.push({
        name: "ProductList",
        params: { productTypeName: item.name }
      });
    }
  },
  watch: {
    devtoolState: function() {
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    }
  }
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.dashboard >>> tbody tr :hover {
  cursor: pointer;
}
</style>
