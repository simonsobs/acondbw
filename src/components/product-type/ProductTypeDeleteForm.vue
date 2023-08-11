<template>
  <v-card class="pa-3">
    <v-card-title class="text-primary">
      <span>
        Delete the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
      </span>
    </v-card-title>
    <v-card-text class="body-1 font-weight-medium text-error">
      Really, delete the type?
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" variant="text" @click="emit('cancel')">
        Cancel
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="outlined" @click="submit"> Delete </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useStore } from "@/stores/main";

import { useDeleteProductTypeMutation } from "@/generated/graphql";

interface Props {
  node: { typeId: number; plural: string };
}

interface Emits {
  (event: "cancel"): void;
  (event: "finished"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();

const { executeMutation } = useDeleteProductTypeMutation();

async function submit() {
  const { error } = await executeMutation({ typeId: prop.node.typeId });
  if (error) throw error;
  store.apolloMutationCalled();
  store.setSnackbarMessage("Deleted");
  emit("finished");
}
</script>
