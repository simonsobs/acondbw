import { ref, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useClientHandle } from "@urql/vue";
import { useAuthStore } from "@/plugins/pinia/stores/auth";
import { checkAuthForCurrentRoute } from "@/plugins/router";

export function useCheckAuth() {
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
}
