<template>
  <app> </app>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useClientHandle } from "@urql/vue";
import { useAuthStore } from "@/stores/auth";
import { checkAuthForCurrentRoute } from "@/router";
import App from "./AppMain.vue";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const urqlClient = useClientHandle().client;
const checked = ref(false);

watch(
  () => route.name,
  async () => {
    if (checked.value) return;
    if (route.name === undefined) return;
    if (isInAuthProcess()) return;
    await authStore.checkIfSignedIn(urqlClient);
    checked.value = true;
  },
  { immediate: true }
);

function isInAuthProcess() {
  return route.name === "OAuthRedirect" || route.name === "Auth";
}

watchEffect(async () => {
  if (authStore.isSignedIn) return;
  await checkAuthForCurrentRoute(router);
});
</script>
