<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Delete the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
      </span>
    </v-card-title>
    <v-card-text class="body-1 font-weight-medium error--text">
      Really, delete the type?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="primary" text @click="submit"> Delete </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useStore } from "@/stores/main";
import { useMutation } from "@urql/vue";

import DELETE_PRODUCT_TYPE from "@/graphql/mutations/DeleteProductType.gql";
import {
  DeleteProductTypeMutation,
  DeleteProductTypeMutationVariables,
} from "@/generated/graphql";

export default defineComponent({
  name: "ProductTypeDeleteForm",
  props: {
    node: {
      type: Object as PropType<{ typeId: number; plural: string }>,
      required: true,
    },
  },
  setup(prop, { emit }) {
    const store = useStore();

    const { executeMutation } = useMutation<
      DeleteProductTypeMutation,
      DeleteProductTypeMutationVariables
    >(DELETE_PRODUCT_TYPE);

    async function submit() {
      const { error } = await executeMutation({ typeId: prop.node.typeId });
      if (error) throw error;
      store.apolloMutationCalled();
      store.setSnackbarMessage("Deleted");
      emit("finished");
    }

    return { submit };
  },
});
</script>
