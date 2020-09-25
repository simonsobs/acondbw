<template>
  <v-autocomplete
    class="search-window"
    outlined
    rounded
    dense
    flat
    hide-details
    solo
    prepend-inner-icon="search"
    placeholder="Type a product name"
    :items="items"
    v-model="value"
    @input="input"
    @focus="focus"
  ></v-autocomplete>
</template>

<script>
import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

import QueryForSearchWindow from "@/graphql/product/QueryForSearchWindow.gql";

export default {
  name: "SearchWindow",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  data: () => ({
    s: 0,
    value: null,
    edges: null,
    devtoolState: null,
    State: State
  }),
  apollo: {
    edges: {
      query: QueryForSearchWindow,
      update: function(data) {
        return data.allProducts.edges;
      },
      result(result) {
      }
    }
  },
  computed: {
    items() {
      return this.edges
        ? this.edges.map(edge => ({
            text: edge.node.name + " (" + edge.node.type_.singular + ")",
            value: edge.node
          }))
        : null;
    }
  },
  methods: {
    focus() {
      this.s += 1;
    },
    input(value) {
      if (!value.type_) {
        return;
      }
      this.$router.push({
        name: "ProductItem",
        params: { productTypeName: value.type_.name, name: value.name }
      });
      this.$nextTick(() => {
        this.value = null;
      });
    }
  }
};
</script>

