<template>
  <v-card>
    <v-card-title class="text-primary">
      <span>
        Update the relations of
        <span class="font-italic"> {{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error"> {{ error }} </v-alert>
    </v-card-text>
    <v-card flat class="px-6 overflow-auto">
      <form-relations v-model="relations" :name="node.name"></form-relations>
      <v-divider></v-divider>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" @click="$emit('cancel')">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="unchanged"
        variant="text"
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import _ from "lodash";

import FormRelations from "./relations/FormRelations.vue";

import { useProductQuery, useUpdateProductMutation } from "@/generated/graphql";

type Product = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useProductQuery>["data"]>["value"]
  >["product"]
>;

type ProductRelationEdge = NonNullable<
  NonNullable<Product["relations"]>["edges"][0]
>;

function composeRelation(edge: ProductRelationEdge) {
  const productId = edge?.node?.other?.productId;
  const typeId = edge?.node?.typeId;
  if (!productId || !typeId) return null; // TODO: throw error
  return { productId: Number(productId), typeId };
}

function composeRelations(node: Product) {
  return (
    node.relations?.edges.flatMap((e) => (e ? composeRelation(e) || [] : [])) ||
    []
  ).sort((a, b) => a.typeId - b.typeId || a.productId - b.productId);
}

interface Props {
  node: Product;
}

interface Emits {
  (event: "finished"): void;
  (event: "cancel"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const error = ref<any>(null);
const store = useStore();

const initialRelations = ref<ReturnType<typeof composeRelations>>(
  composeRelations(prop.node)
);
const relations = ref<typeof initialRelations>(
  JSON.parse(JSON.stringify(initialRelations.value))
);

const input = computed(() => composeInput(relations.value));

function composeInput<T>(relations: T[]): T[] {
  // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
  return [...new Set(relations.map((o) => JSON.stringify(o)))].map((s) =>
    JSON.parse(s)
  );
}

const unchanged = computed(
  () =>
    JSON.stringify(relations.value) === JSON.stringify(initialRelations.value)
);

const { executeMutation } = useUpdateProductMutation();

async function submit() {
  try {
    const updateProductInput = { relations: input.value };
    const { error } = await executeMutation({
      productId: Number(prop.node.productId),
      input: updateProductInput,
    });
    if (error) throw error;
    store.apolloMutationCalled();
    store.setSnackbarMessage("Updated");
    emit("finished");
  } catch (e) {
    error.value = e;
  }
}
</script>
