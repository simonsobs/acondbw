<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="loading"></div>
  <provide-config-exe v-else-if="config" :config="config">
    <slot></slot>
  </provide-config-exe>
</template>

<script setup lang="ts">
/**
 * Render the slot after loading the config and providing it to the slot.
 */
import { useLoadConfig } from "@/utils/config";
import ProvideConfigExe from "./ProvideConfigExe.vue";
const { config, loading, error } = useLoadConfig();
</script>
