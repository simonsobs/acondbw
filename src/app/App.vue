<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="loading"></div>
  <provide-urql-client v-else-if="preConfig" :pre-config="preConfig">
    <app> </app>
  </provide-urql-client>
</template>

<script setup lang="ts">
/**
 * Render the main app after the pre-config is loaded.
 */
import { storeToRefs } from "pinia";
import { usePreConfigStore } from "@/stores/pre-config";
import ProvideUrqlClient from "./ProvideUrqlClient.vue";
import App from "./AppMain.vue";
const { preConfig, loading, error } = storeToRefs(usePreConfigStore());
</script>
