<template>
  <app v-if="!(loading || error)"> </app>
  <div v-else-if="error">{{ error }}</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePreConfigStore } from "@/stores/pre-config";
import App from "./AppWrapperProvideUrqlClient.vue";
const { loading, error } = storeToRefs(usePreConfigStore());
</script>
