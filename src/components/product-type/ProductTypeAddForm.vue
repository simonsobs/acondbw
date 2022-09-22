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
      <v-card-title class="primary--text">
        <span>
          Add a
          <span class="font-italic"> product type </span>
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
          :disabled="!valid"
          text
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

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import { useStore } from "@/stores/main";
import { useQuery, useMutation } from "@urql/vue";

import CREATE_PRODUCT_TYPE from "@/graphql/mutations/CreateProductType.gql";
import ALL_FIELDS from "@/graphql/queries/AllFields.gql";
import {
  CreateProductTypeMutation,
  CreateProductTypeMutationVariables,
  CreateProductTypeInput,
  AllFieldsQuery,
} from "@/generated/graphql";

import FormProductType from "./FormProductType.vue";

import { useQueryState } from "@/utils/query-state";

type PropType = NonNullable<InstanceType<typeof FormProductType>["value"]>;

const initialValue: PropType = {
  name: "",
  order: 1,
  indefArticle: "a",
  singular: "",
  plural: "",
  icon: "mdi-beaker-question-outline",
};

export default defineComponent({
  name: "ProductTypeAddForm",
  components: { FormProductType },
  setup(prop, { emit }) {
    const store = useStore();
    const query = useQuery<AllFieldsQuery>({ query: ALL_FIELDS });
    const fields = computed(
      () =>
        query.data?.value?.allFields?.edges?.flatMap((e) =>
          e?.node ? [e.node] : []
        ) || []
    );
    const fieldIds = computed(() => {
      return fields.value.map(({ fieldId }) => parseInt(fieldId, 10));
    });

    const value = ref<PropType>(initialValue);
    const valid = ref(false);

    const input = computed(() =>
      valid.value
        ? ({ ...value.value, fieldIds: fieldIds.value } as CreateProductTypeInput)
        : null
    );

    const { executeMutation } = useMutation<
      CreateProductTypeMutation,
      CreateProductTypeMutationVariables
    >(CREATE_PRODUCT_TYPE);

    async function submit() {
      if (input.value === null) throw new Error("Invalid input");
      const { error } = await executeMutation({ input: input.value });
      if (error) throw error;
      store.apolloMutationCalled();
      store.setSnackbarMessage("Added");
      emit("finished", input.value.name);
    }

    return {
      ...useQueryState(query, {
        isEmpty: (query) => fields.value.length === 0,
      }),
      fields,
      fieldIds,
      value,
      valid,
      input,
      submit,
    };
  },
});
</script>
