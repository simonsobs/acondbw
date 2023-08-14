<template>
  <div class="top-bar">
    <v-tooltip v-if="node && node.type_" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="plain"
          icon
          :to="{
            name: 'ProductList',
            params: { productTypeName: node.type_.name },
          }"
        >
          <v-icon icon="mdi-arrow-left"></v-icon>
        </v-btn>
      </template>
      <span>Back to the list</span>
    </v-tooltip>
    <v-tooltip location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :disabled="disabled"
          variant="plain"
          icon
          @click="emit('refresh')"
        >
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </template>
      <span>Refresh</span>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ProductQuery } from "@/generated/graphql";

type Product = ProductQuery["product"];

interface Props {
  node: Product | undefined;
  disabled?: boolean;
}

interface Emits {
  (event: "refresh"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<style scoped>
.top-bar {
  display: flex;
  min-block-size: 56px;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1rem;
}
</style>
