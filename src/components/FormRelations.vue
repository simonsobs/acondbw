<template>
  <v-container fluid class="px-0">
    <v-row justify="end" class="mx-0">
      <v-tooltip bottom open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="refetch()" v-on="on">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
    </v-row>
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
    <v-btn color="secondary" outlined text class="mx-2" @click="addField()">Add a field</v-btn>
  </v-container>
</template>

<script>
import _ from "lodash";

import QueryForFormRelations from "@/graphql/QueryForFormRelations.gql";

const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null
};

export default {
  name: "FormRelations",
  props: ["relations"],
  data() {
    return {
      allProductRelationTypes: null,
      allProductTypes: null,
      queryError: null,
      relationTypeItems: null,
      productTypeMap: {},
      productTypeItems: null
    };
  },
  methods: {
    addField() {
      this.relations.push({ ...formRelationDefault });
    },
    refetch() {
      Object.values(this.$apollo.queries).forEach(query => query.refetch());
    }
  },
  apollo: {
    allProductRelationTypes: {
      query: QueryForFormRelations,
      result(result) {
        this.queryError = result.error ? result.error : null;

        if (this.queryError) {
          return;
        }

        this.allProductRelationTypes = result.data.allProductRelationTypes;
        this.allProductTypes = result.data.allProductTypes;

        this.relationTypeItems = this.allProductRelationTypes.edges.map(
          ({ node }) => ({
            text: node.singular,
            value: node.typeId
          })
        );

        this.productTypeItems = this.allProductTypes.edges.map(({ node }) => ({
          text: node.singular,
          value: node.typeId
        }));

        this.productTypeMap = _.reduce(
          this.allProductTypes.edges,
          (a, { node }) => ({
            ...a,
            [node.typeId]: node.products.edges.map(({ node }) => ({
              text: node.name,
              value: node.productId
            }))
          }),
          {}
        );
      }
    }
  }
};
</script>
