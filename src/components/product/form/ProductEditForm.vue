<template>
  <v-card>
    <v-card-title class="text-primary">
      <span>
        Edit
        <span class="font-italic"> {{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error"> {{ error }} </v-alert>
    </v-card-text>
    <v-card flat class="px-3 overflow-auto">
      <v-divider class="mb-5"></v-divider>
      <form-start
        v-model="value"
        v-model:valid="valid"
        :productType="node.type_"
      >
      </form-start>
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
import { ref, computed } from "vue";
import { useStore } from "@/stores/main";

import { camelCase } from "camel-case";

import {
  useProductQuery,
  useUpdateProductMutation,
  UpdateProductInput,
} from "@/generated/graphql";

import FormStart from "./start/FormStart.vue";

export type Product = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useProductQuery>["data"]>["value"]
  >["product"]
>;

interface Attribute {
  fieldId: number;
  name: string;
  value: unknown;
}

export interface Attributes {
  [key: string]: Attribute;
}

type TypeFieldAssociation = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<NonNullable<Product["type_"]>["fields"]>["edges"]
    >[number]
  >["node"]
>;

interface Fields {
  [key: string]: TypeFieldAssociation;
}

interface Props {
  node: Product;
  attributes: Attributes;
}

interface Emits {
  (event: "finished", name: string): void;
  (event: "cancel"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();
const error = ref<any>(null);

const initialValue = ref({
  name: prop.node.name,
  dateProduced: prop.attributes["date_produced"].value as string | "",
  producedBy: prop.attributes["produced_by"].value as string | "",
  contact: prop.attributes["contact"].value as string | "",
  paths: prop.node.paths?.edges?.flatMap((e) => e?.node?.path).join("\n") || "",
  note: prop.node.note ?? "",
});

const value = ref({ ...initialValue.value });

const valid = ref(false);

const fields = computed(() =>
  prop.node?.type_?.fields?.edges.reduce(
    (a, e) =>
      e?.node?.field
        ? {
            ...a,
            ...{
              [camelCase(e.node.field.name)]: e.node,
            },
          }
        : a,
    {} as Fields
  )
);

const unchanged = computed(
  () => JSON.stringify(value.value) === JSON.stringify(initialValue.value)
);

const input = computed(() =>
  valid.value
    ? composeUpdateProductInput(value.value, initialValue.value)
    : null
);

type Value = typeof value.value;

function composeUpdateProductInput(value: Value, initialValue: Value) {
  const ret: UpdateProductInput = {};
  if (value.name !== initialValue.name) ret.name = value.name;
  if (value.note !== initialValue.note) ret.note = value.note;

  if (value.paths !== initialValue.paths)
    ret.paths = value.paths
      ?.split("\n")
      .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
      .filter(Boolean) // remove empty strings
      .filter((v, i, a) => a.indexOf(v) === i); // unique

  const keys = ["contact", "dateProduced", "producedBy"].filter(
    (k) => value[k] !== initialValue[k] && k in (fields.value || {})
  );
  if (keys.length)
    ret.attributes = keys.reduce((a, k) => {
      const typeEnum = fields.value?.[k].field?.type_;
      if (!typeEnum) throw new Error("no type");
      const typeName = camelCase(typeEnum);
      a[typeName] = a[typeName] ? a[typeName] : [];
      a[typeName].push({
        fieldId: fields.value[k].fieldId,
        value: value[k],
      });
      return a;
    }, {});

  return ret;
}

const { executeMutation } = useUpdateProductMutation();
async function submit() {
  try {
    if (input.value === null) throw new Error("input is null");
    const { error } = await executeMutation({
      productId: Number(prop.node.productId),
      input: input.value,
    });
    if (error) throw error;
    store.apolloMutationCalled();
    store.setSnackbarMessage("Updated");
    emit("finished", input.value.name ?? "");
  } catch (e) {
    error.value = e;
  }
}
</script>
