<template>
  <app> </app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { provideClient } from "@urql/vue";
import { createUrqlClient } from "@/plugins/urql";
import App from "./AppWrapperLoadConfig.vue";
const urqlClient = ref(createUrqlClient());
provideClient(urqlClient);
</script>
