<template>
  <div class="g-container">
    <v-progress-circular
      indeterminate
      :size="18"
      :width="3"
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClientHandle } from "@urql/vue";
import { useStore } from "@/plugins/pinia/stores/main";
import { useAuthStore } from "@/plugins/pinia/stores/auth";
import { validateState, decodeState } from "@/utils/auth/oauth";

const route = useRoute();
const router = useRouter();
const store = useStore();
const authStore = useAuthStore();
const urqlClientHandle = useClientHandle();

async function main() {
  const state = route.query.state;
  if (!(typeof state === "string" && validateState(state))) {
    router.push({ name: "Entry" });
    return;
  }

  if (route.query.error) {
    authStore.setRequestAuthError(route.query);
    router.push({ name: "SignInError" });
    return;
  }

  const code = route.query.code;
  if (!(typeof code === "string" && code)) {
    router.push({ name: "Entry" });
    return;
  }

  try {
    await authStore.signIn(code, state, urqlClientHandle.client);
  } catch (error) {
    router.push({ name: "SignInError" });
    return;
  }
  const rawState = decodeState(state);
  const { path } = JSON.parse(rawState.option);
  store.setSnackbarMessage("Signed in");
  await router.push(path);
}

onMounted(async () => {
  await main();
});
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
