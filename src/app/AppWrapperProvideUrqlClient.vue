<template>
  <app> </app>
</template>

<script setup lang="ts">
import { PreConfig } from "@/stores/pre-config";
import { useProvideClient } from "@/plugins/urql";
import App from "./AppWrapperAuth.vue";

interface Props {
  preConfig: PreConfig;
}
const prop = defineProps<Props>();
const url = prop.preConfig.graphqlHttp;
useProvideClient(url);
</script>
