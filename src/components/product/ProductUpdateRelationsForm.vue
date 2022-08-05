<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Update the relations of
        <span class="font-italic"> {{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error"> {{ error }} </v-alert>
    </v-card-text>
    <v-card flat class="px-6">
      <form-relations v-model="relations" :name="node.name"></form-relations>
      <v-divider></v-divider>
    </v-card>
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
import _ from "lodash";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";
import FormRelations from "./FormRelations.vue";

export default Vue.extend({
  name: "ProductUpdateRelationsForm",
  components: {
    FormRelations,
  },
  props: {
    node: Object,
  },
  data() {
    const initialRelations = this.composeRelations(this.node);
    return {
      initialRelations,
      relations: JSON.parse(JSON.stringify(initialRelations)),
      error: null,
    };
  },
  computed: {
    input() {
      return this.composeInput(this.relations);
    },
    unchanged() {
      return (
        JSON.stringify(this.relations) === JSON.stringify(this.initialRelations)
      );
    },
  },
  methods: {
    composeRelations(node) {
      return node.relations.edges.map(({ node }) => ({
        productId: node.other.productId,
        typeId: node.type_.typeId,
      }));
    },
    composeInput(relations) {
      // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
      return [...new Set(relations.map((o) => JSON.stringify(o)))].map((s) =>
        JSON.parse(s)
      );
    },
    async submit() {
      try {
        const updateProductInput = { relations: this.input };
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
            input: updateProductInput,
          },
        });

        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Updated");
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    },
  },
});
</script>
