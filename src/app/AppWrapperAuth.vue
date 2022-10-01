<template>
  <app> </app>
</template>

<script setup lang="ts">
import { watchEffect, onBeforeMount } from "vue";
import { useRouter } from "vue-router/composables";
import { useClientHandle } from "@urql/vue";
import { useAuthStore } from "@/stores/auth";
import { checkAuthForCurrentRoute } from "@/router";
import App from "./AppWrapperVuetifyTheme.vue";
const router = useRouter();
const authStore = useAuthStore();
const urqlClient = useClientHandle().client;
onBeforeMount(async () => {
  await authStore.checkIfSignedIn(urqlClient);
});
watchEffect(async () => {
  if (authStore.isSignedIn) return;
  await checkAuthForCurrentRoute(router);
});
</script>
