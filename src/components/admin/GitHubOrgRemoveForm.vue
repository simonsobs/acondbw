<template>
  <v-card>
    <v-card-title class="headline">Remove</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-card-text>
    <v-card-text class="body-1 font-weight-medium error--text">
      Really, remove "{{ login }}" ?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="error" :disabled="!props.login" text @click="remove">
        Remove
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/main";

import { useDeleteGitHubOrgMutation } from "@/generated/graphql";

const props = defineProps<{
  login?: string;
}>();

const emit = defineEmits(["cancel", "finished"]);

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

const { executeMutation } = useDeleteGitHubOrgMutation();
async function remove() {
  try {
    if(!props.login) throw new Error("login is required");
    const { error } = await executeMutation({
      login: props.login,
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
