<template>
  <v-container fluid class="px-0">
    <v-row class="mx-0 mb-3 px-0" v-for="(r, i) in relations" :key="i">
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Relation type"
          :items="relationTypeItems"
          clearable
          v-model="r.typeId"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Product type"
          :items="productTypeItems"
          clearable
          v-model="r.productTypeId"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Product"
          :items="productTypeMap[r.productTypeId]"
          clearable
          hide-no-data
          v-model="r.productId"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-btn color="secondary" outlined text class="mx-2" @click="addRelationField()">Add a field</v-btn>
  </v-container>
</template>

<script>
const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null
};

export default {
  name: "FormRelations",
  props: [
    "relations",
    "relationTypeItems",
    "productTypeItems",
    "productTypeMap"
  ],
  data() {
    return {};
  },
  methods: {
    addRelationField() {
      this.relations.push({ ...formRelationDefault });
    }
  }
};
</script>
