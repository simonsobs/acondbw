<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn
      color="secondary"
      variant="text"
      :disabled="saved"
      @click="emit('reset')"
    >
      Reset
    </v-btn>
    <v-btn
      color="primary"
      variant="text"
      :disabled="saved || !!error"
      @click="emit('save')"
    >
      Save to server
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
interface Props {
  saved: boolean;
  error: boolean;
}

interface Emits {
  (event: "reset"): void;
  (event: "save"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
