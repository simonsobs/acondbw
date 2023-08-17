<template>
  <app> </app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PreConfig } from "@/stores/pre-config";
import { provideClient } from "@urql/vue";
import { createUrqlClient } from "@/plugins/urql";
import App from "./AppWrapperAuth.vue";

interface Props {
  preConfig: PreConfig;
}
const prop = defineProps<Props>();

const url = prop.preConfig.graphqlHttp;
const urqlClient = ref(createUrqlClient(url));
provideClient(urqlClient);
</script>
