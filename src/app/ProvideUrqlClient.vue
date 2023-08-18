<template>
  <slot></slot>
</template>

<script setup lang="ts">
/**
 * Provide the urql client to the app.
 *
 * This component receives the pre-config from the parent component
 * and provides the urql client to the child components.
 *
 * The current implementation might not be the best way. It is a result of
 * few constraints:
 * - useProvideClient() must be called in the setup() function
 * - the pre-config is loaded asynchronously
 * - the urql client must be provided before the child components are rendered
 *
 * The parent component renders this component after the pre-config is loaded.
 */
import { PreConfig } from "./pre-config";
import { useProvideClient } from "@/plugins/urql";

interface Props {
  preConfig: PreConfig;
}

const prop = defineProps<Props>();
const url = prop.preConfig.graphqlHttp;
useProvideClient(url);
</script>
