<template>
  <v-card class="pa-2">
    <v-card-title class="headline">Remove</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-card-text>
    <v-card-text class="body-1 font-weight-medium text-error">
      Really, remove?
    </v-card-text>
    <v-card-actions class="mt-3">
      <v-btn color="secondary" @click="cancel">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="outlined" @click="remove">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/main";

import { useDeleteLogMutation } from "@/generated/graphql";

const props = defineProps<{
  id_: number;
}>();

interface Emits {
  (e: "cancel"): void;
  (e: "finished"): void;
}

const emit = defineEmits<Emits>();

const store = useStore();
const error = ref<any>(null);

function cancel() {
  emit("cancel");
  delayedReset();
}

function delayedReset() {
  // reset 0.5 sec after so that the reset form won't be shown.
  setTimeout(() => {
    reset();
  }, 500);
}

function reset() {
  error.value = null;
}

const { executeMutation } = useDeleteLogMutation();
async function remove() {
  try {
    if (!props.id_) throw new Error("Id is required");
    const { error } = await executeMutation({
      id_: props.id_,
    });
    if (error) throw error;
    store.apolloMutationCalled();
    store.setSnackbarMessage("Removed");
    emit("finished");
    delayedReset();
  } catch (e) {
    error.value = e;
  }
}
</script>
