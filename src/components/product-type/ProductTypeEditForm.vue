<template>
  <v-card>
    <v-card-title class="text-primary">
      <span>
        Change the settings of the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
      </span>
    </v-card-title>
    <v-card flat class="px-3 overflow-auto">
      <v-divider class="mb-5"></v-divider>
      <form-product-type v-model="value" @valid="valid = $event">
      </form-product-type>
      <v-divider></v-divider>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" @click="$emit('cancel')">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="unchanged || !valid"
        variant="text"
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, readonly } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import {
  UpdateProductTypeInput,
  ProductTypeByNameQuery,
  useUpdateProductTypeMutation,
} from "@/generated/graphql";

import FormProductType from "./FormProductType.vue";

type FormType = NonNullable<InstanceType<typeof FormProductType>["modelValue"]>;
type NodeType = NonNullable<ProductTypeByNameQuery["productType"]>;

interface Props {
  node: NodeType;
}

interface Emits {
  (event: "finished", name: string): void;
  (event: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();
const initialValue = readonly<FormType>({
  name: props.node.name,
  order: props.node.order,
  indefArticle: props.node.indefArticle,
  singular: props.node.singular,
  plural: props.node.plural,
  icon: props.node.icon,
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

const { executeMutation } = useUpdateProductTypeMutation();

async function submit() {
  const typeId = Number(props.node.typeId);
  if (isNaN(typeId)) throw new Error("Invalid type ID");
  if (input.value === null) throw new Error("Invalid input");
  const { error } = await executeMutation({ typeId, input: input.value });
  if (error) throw error;
  store.apolloMutationCalled();
  store.setSnackbarMessage("Updated");
  emit("finished", input.value.name ?? "");
}
</script>
