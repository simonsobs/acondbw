<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Convert
        <span class="font-italic"> {{ node.name }} </span>
        to another type
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <span>
        Current type:
        <span class="font-italic"> {{ node.type_.singular }} </span>
      </span>
    </v-card-text>
    <v-card-text>
      <v-autocomplete
        outlined
        label="New type"
        :items="items"
        v-model="newTypeId"
      ></v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="primary" :disabled="unchanged" text @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import CONVERT_PRODUCT_TYPE from "@/graphql/mutations/ConvertProductType.gql";
import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";
import PRODUCT_TYPE from "@/graphql/queries/ProductType.gql";

export default Vue.extend({
  name: "ProductConvertTypeForm",
  props: {
    node: Object,
  },
  data() {
    return {
      newTypeId: this.node.type_.typeId,
      allProductTypes: { edges: [] },
      productType: { name: this.node.type_.name },
      error: null,
    };
  },
  computed: {
    items() {
      return (
        this.allProductTypes.edges
          // .filter(({ node }) => node.typeId != this.node.type_.typeId)
          .map(({ node }) => ({
            text: node.singular,
            value: node.typeId,
          }))
      );
    },
    unchanged() {
      return (
        this.newTypeId == this.node.type_.typeId &&
        this.newTypeName == this.node.type_.name
      );
    },
    newTypeName() {
      return this.productType.name;
    },
  },
  apollo: {
    allProductTypes: {
      query: ALL_PRODUCT_TYPES,
    },
    productType: {
      query: PRODUCT_TYPE,
      variables() {
        return {
          typeId: this.newTypeId,
        };
      },
    },
  },
  methods: {
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: CONVERT_PRODUCT_TYPE,
          variables: {
            productId: this.node.productId,
            typeId: this.newTypeId,
          },
        });
        this.$apollo.provider.defaultClient.cache.data.data = {};
        this.apolloMutationCalled();
        this.setSnackbarMessage("Converted");
        this.$emit("finished", this.newTypeName);
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
