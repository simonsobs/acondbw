<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="loading"></div>
  <app v-else-if="preConfig" :pre-config="preConfig"> </app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePreConfigStore } from "@/stores/pre-config";
import App from "./AppWrapperProvideUrqlClient.vue";
const { preConfig, loading, error } = storeToRefs(usePreConfigStore());
</script>
