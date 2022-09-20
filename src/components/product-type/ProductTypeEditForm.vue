<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Change the settings of the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
      </span>
    </v-card-title>
    <v-card flat class="px-3">
      <v-divider class="mb-5"></v-divider>
      <form-product-type v-model="value" @valid="valid = $event">
      </form-product-type>
      <v-divider></v-divider>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn
        color="primary"
        :disabled="unchanged || !valid"
        text
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, readonly, PropType } from "vue";
import { useStore } from "@/stores/main";
import { useMutation } from "@urql/vue";

import UPDATE_PRODUCT_TYPE from "@/graphql/mutations/UpdateProductType.gql";
import {
  UpdateProductTypeMutation,
  UpdateProductTypeMutationVariables,
  UpdateProductTypeInput,
  ProductTypeByNameQuery,
} from "@/generated/graphql";

import FormProductType from "./FormProductType.vue";

type FormType = NonNullable<InstanceType<typeof FormProductType>["value"]>;
type NodeType = NonNullable<ProductTypeByNameQuery["productType"]>;

export default defineComponent({
  name: "ProductTypeEditForm",
  components: { FormProductType },
  props: {
    node: { type: Object as PropType<NodeType>, required: true },
  },
  setup(prop, { emit }) {
    const store = useStore();
    const initialValue = readonly<FormType>({
      name: prop.node.name,
      order: prop.node.order,
      indefArticle: prop.node.indefArticle,
      singular: prop.node.singular,
      plural: prop.node.plural,
      icon: prop.node.icon,
    });

    const value = ref<FormType>(initialValue);

    const valid = ref(false);

    const unchanged = computed(
      () => JSON.stringify(value.value) === JSON.stringify(initialValue)
    );

    const input = computed(() => {
      if (!valid.value) return null;
      const keys = Object.keys(value.value) as (keyof FormType)[];
      return Object.fromEntries(
        keys.flatMap((k) =>
          value.value[k] !== initialValue[k] ? [[k, value.value[k]]] : []
        )
      ) as UpdateProductTypeInput;
    });

    const { executeMutation } = useMutation<
      UpdateProductTypeMutation,
      UpdateProductTypeMutationVariables
    >(UPDATE_PRODUCT_TYPE);

    async function submit() {
      const typeId = Number(prop.node.typeId);
      if (isNaN(typeId)) throw new Error("Invalid type ID");
      if (input.value === null) throw new Error("Invalid input");
      const { error } = await executeMutation({ typeId, input: input.value });
      if (error) throw error;
      store.apolloMutationCalled();
      store.setSnackbarMessage("Updated");
      emit("finished", input.value.name);
    }

    return {
      initialValue,
      value,
      valid,
      unchanged,
      input,
      submit,
    };
  },
});
</script>
