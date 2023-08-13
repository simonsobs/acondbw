<template>
  <v-btn variant="plain" icon @click.stop="toggle">
    <v-icon :icon="icon"> </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { withDefaults, computed } from "vue";

interface Props {
  collapsed?: boolean;
}

interface Emits {
  (e: "expand", value: void): void;
  (e: "collapse", value: void): void;
}

const prop = withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const emit = defineEmits<Emits>();

function toggle() {
  if (prop.collapsed) {
    emit("expand");
  } else {
    emit("collapse");
  }
}

const icon = computed(() =>
  prop.collapsed ? "mdi-chevron-down" : "mdi-chevron-up"
);
</script>
