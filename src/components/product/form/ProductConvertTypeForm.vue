<template>
  <v-card>
    <v-card-title class="text-primary">
      <span>
        Convert
        <span class="font-italic"> {{ node.name }} </span>
        to another type
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" variant="tonal" type="error"> {{ error }} </v-alert>
      <span v-if="node && node.type_">
        Current type:
        <span class="font-italic"> {{ node.type_.singular }} </span>
      </span>
    </v-card-text>
    <v-card-text>
      <v-autocomplete
        variant="outlined"
        label="New type"
        :items="items"
        v-model="newTypeId"
      ></v-autocomplete>
    </v-card-text>
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

import {
  useConvertProductTypeMutation,
  useProductQuery,
  useAllProductTypesQuery,
  useProductTypeQuery,
} from "@/graphql/codegen/generated";

type Product = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useProductQuery>["data"]>["value"]
  >["product"]
>;

interface Props {
  node: Product;
}

interface Emits {
  (event: "finished", name: string): void;
  (event: "cancel"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const error = ref<any>(null);
const store = useStore();
const typeId = prop.node.type_?.typeId;
const newTypeId = ref<number | undefined>(typeId ? Number(typeId) : undefined);
const productTypeQuery = useProductTypeQuery({
  variables: { typeId: newTypeId },
});
const productType = computed(() => productTypeQuery.data?.value?.productType);

const allProductTypesQuery = useAllProductTypesQuery();
const allProductTypes = computed(
  () => allProductTypesQuery.data?.value?.allProductTypes
);

const items = computed(
  () =>
    allProductTypes?.value?.edges.flatMap((e) =>
      e?.node
        ? {
            title: e.node.singular,
            value: Number(e.node.typeId),
          }
        : []
    ) || []
);

const newTypeName = computed(() => productType.value?.name);

const unchanged = computed(
  () =>
    newTypeId.value === Number(prop.node?.type_?.typeId) &&
    newTypeName.value === prop.node.type_?.name
);

const { executeMutation } = useConvertProductTypeMutation();
async function submit() {
  try {
    if (!newTypeId.value) throw new Error("typeId is required");
    const { error } = await executeMutation({
      productId: Number(prop.node.productId),
      typeId: newTypeId.value,
    });
    if (error) throw error;
    store.apolloMutationCalled();
    store.setSnackbarMessage("Converted");
    emit("finished", newTypeName.value ?? "");
  } catch (e) {
    error.value = e;
  }
}
</script>
