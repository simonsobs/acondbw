<template>
  <app> </app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePreConfigStore } from "@/stores/pre-config";
import { provideClient } from "@urql/vue";
import { createUrqlClient } from "@/plugins/urql";
import App from "./AppWrapperAuth.vue";
const preConfigStore = usePreConfigStore();
const url = preConfigStore.preConfig?.graphqlHttp;
if(!url) throw new Error("api url is not found");
const urqlClient = ref(createUrqlClient(url));
provideClient(urqlClient);
</script>
