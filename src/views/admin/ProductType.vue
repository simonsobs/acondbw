<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Product Types</v-card-title>
          <product-type-table></product-type-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductTypeTable from "@/components/product-type/Table.vue";

export default {
  name: "ProductType",
  components: {
    ProductTypeTable,
  },
  data: () => ({}),
};
</script>
