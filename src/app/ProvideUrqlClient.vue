<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { PreConfig } from "@/stores/pre-config";
import { useProvideClient } from "@/plugins/urql";

interface Props {
  preConfig: PreConfig;
}
const prop = defineProps<Props>();
const url = prop.preConfig.graphqlHttp;
useProvideClient(url);
</script>
