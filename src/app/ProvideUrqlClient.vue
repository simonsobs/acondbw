<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useConfig } from "@/utils/config";
import { useProvideClient } from "@/graphql/urql";
const { config } = useConfig();
const url = config.value.graphqlHttp;
useProvideClient(url);
</script>
