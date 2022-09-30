<template>
  <app> </app>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/stores/config";
import App from "./AppWrapperAuth.vue";
const configStore = useConfigStore();
configStore.setup();
</script>
