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
import { defineComponent, PropType } from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import _ from "lodash";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";
import FormRelations from "./FormRelations.vue";
import { client } from "@/plugins/urql";

import { Product, ProductRelationEdge } from "@/generated/graphql";

function composeRelation(edge: ProductRelationEdge) {
  const productId = edge?.node?.other?.productId;
  const typeId = edge?.node?.typeId;
  if (!productId || !typeId) return null; // TODO: throw error
  return { productId, typeId };
}

function composeRelations(node: Product) {
  return (
    node.relations?.edges.flatMap((e) => (e ? composeRelation(e) || [] : [])) ||
    []
  ).sort((a, b) => a.typeId - b.typeId || a.productId.localeCompare(b.productId));
}

export default defineComponent({
  name: "ProductUpdateRelationsForm",
  components: {
    FormRelations,
  },
  props: {
    node: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  data() {
    const initialRelations = composeRelations(this.node);
    return {
      initialRelations,
      relations: JSON.parse(JSON.stringify(initialRelations)) as ReturnType<
        typeof composeRelations
      >,
      error: null as any,
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
    composeInput<T>(relations: T[]): T[] {
      // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
      return [...new Set(relations.map((o) => JSON.stringify(o)))].map((s) =>
        JSON.parse(s)
      );
    },
    async submit() {
      try {
        const updateProductInput = { relations: this.input };
        const { error, data } = await client
          .mutation(UPDATE_PRODUCT, {
            productId: this.node.productId,
            input: updateProductInput,
          })
          .toPromise();
        if (error) throw error;
        this.apolloMutationCalled();
        this.setSnackbarMessage("Updated");
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
