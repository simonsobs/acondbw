<template>
  <div class="ma-4 d-flex justify-end" style="gap: 12px">
    <v-btn
      color="secondary"
      variant="outlined"
      :disabled="saved"
      @click="emit('reset')"
    >
      Reset
    </v-btn>
    <v-btn
      color="primary"
      variant="tonal"
      :disabled="saved || !!error"
      @click="emit('save')"
    >
      Save to server
    </v-btn>
  </div>
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
