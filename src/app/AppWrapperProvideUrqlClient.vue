<template>
  <app> </app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { provideClient } from "@urql/vue";
import { client } from "@/plugins/urql";
import App from "./App.vue";
const urqlClient = ref(client);
provideClient(urqlClient);
</script>
