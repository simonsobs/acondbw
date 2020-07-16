<template>
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
</template>

<script>
import ALL_PRODUCTS_TYPES from "@/graphql/AllProductTypes.gql";

export default {
  name: "Navigation",
  data: () => ({
    edges: null,
    error: null
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
  }
};
</script>
