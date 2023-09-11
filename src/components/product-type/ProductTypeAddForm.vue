<template>
  <v-card>
    <v-card-text v-if="loading" class="pa-5">
      <v-progress-circular
        indeterminate
        :size="26"
        color="secondary"
      ></v-progress-circular>
    </v-card-text>
    <template v-if="loaded">
      <v-card-title class="text-primary">
        <span>
          Add a
          <span class="font-italic"> product type </span>
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
          :disabled="!valid"
          variant="text"
          @click="submit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </template>
    <dev-tool-loading-state-menu
      top="1px"
      right="1px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import {
  CreateProductTypeInput,
  useAllFieldsQuery,
  useCreateProductTypeMutation,
} from "@/graphql/codegen/generated";

import FormProductType from "./FormProductType.vue";

import { useQueryState } from "@/utils/query-state";

type FormType = NonNullable<InstanceType<typeof FormProductType>["modelValue"]>;

interface Emits {
  (event: "finished", name: string): void;
  (event: "cancel"): void;
}
const emit = defineEmits<Emits>();

const initialValue: FormType = {
  name: "",
  order: 1,
  indefArticle: "a",
  singular: "",
  plural: "",
  icon: "mdi-beaker-question",
};

const store = useStore();
const query = useAllFieldsQuery();
const fields = computed(
  () =>
    query.data?.value?.allFields?.edges?.flatMap((e) =>
      e?.node ? [e.node] : []
    ) || []
);
const fieldIds = computed(() => {
  return fields.value.map(({ fieldId }) => parseInt(fieldId, 10));
});

const value = ref<FormType>(initialValue);
const valid = ref(false);

const input = computed(() =>
  valid.value
    ? ({
        ...value.value,
        fieldIds: fieldIds.value,
      } as CreateProductTypeInput)
    : null
);

const { executeMutation } = useCreateProductTypeMutation();

async function submit() {
  if (input.value === null) throw new Error("Invalid input");
  const { error } = await executeMutation({ input: input.value });
  if (error) throw error;
  store.apolloMutationCalled();
  store.setSnackbarMessage("Added");
  emit("finished", input.value.name);
}

const { loading, loaded, devtoolState } = useQueryState(query, {
  isEmpty: (query) => fields.value.length === 0,
});
</script>
