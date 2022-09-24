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
      <span v-if="node && node.type_">
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
import { defineComponent, PropType, ref, computed } from "vue";
import { useStore } from "@/stores/main";

import {
  useConvertProductTypeMutation,
  useProductQuery,
  useAllProductTypesQuery,
  useProductTypeQuery,
} from "@/generated/graphql";

type Product = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useProductQuery>["data"]>["value"]
  >["product"]
>;

export default defineComponent({
  name: "ProductConvertTypeForm",
  props: {
    node: { type: Object as PropType<Product>, required: true },
  },
  setup(prop, { emit }) {
    const error = ref<any>(null);
    const store = useStore();
    const typeId = prop.node.type_?.typeId;
    const newTypeId = ref<number | undefined>(
      typeId ? Number(typeId) : undefined
    );
    const productTypeQuery = useProductTypeQuery({
      variables: { typeId: newTypeId },
    });
    const productType = computed(
      () => productTypeQuery.data?.value?.productType
    );

    const allProductTypesQuery = useAllProductTypesQuery();
    const allProductTypes = computed(
      () => allProductTypesQuery.data?.value?.allProductTypes
    );

    const items = computed(
      () =>
        allProductTypes?.value?.edges.flatMap((e) =>
          e?.node
            ? {
                text: e.node.singular,
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
        if(!newTypeId.value) throw new Error("typeId is required");
        const { error } = await executeMutation({
          productId: Number(prop.node.productId),
          typeId: newTypeId.value,
        });
        if (error) throw error;
        store.apolloMutationCalled();
        store.setSnackbarMessage("Converted");
        emit("finished", newTypeName.value);
      } catch (e) {
        error.value = e;
      }
    }

    return {
      error,
      newTypeId,
      productType,
      allProductTypes,
      items,
      newTypeName,
      unchanged,
      submit
    };
  },
});
</script>
