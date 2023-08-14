<template>
  <v-btn variant="plain" icon @click.stop="toggle">
    <v-icon :icon="icon"> </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { withDefaults, computed } from "vue";

interface Props {
  modelValue?: boolean;
}

interface Emits {
  (event: "update:modelValue", value: boolean): void;
}

const prop = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<Emits>();

function toggle() {
  emit("update:modelValue", !prop.modelValue);
}

const icon = computed(() =>
  prop.modelValue ? "mdi-chevron-down" : "mdi-chevron-up"
);
</script>
