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

<script lang="ts">
import { defineComponent } from "vue";
import ProductTypeTable from "@/components/product-type/Table.vue";

export default defineComponent({
  name: "ProductType",
  components: { ProductTypeTable },
});
</script>
