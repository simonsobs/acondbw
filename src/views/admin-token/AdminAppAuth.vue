<template>
  <div class="g-container">
    <v-progress-circular
      indeterminate
      :size="18"
      :width="3"
      color="secondary"
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClientHandle } from "@urql/vue";
import { useStore } from "@/plugins/pinia/stores/main";

import { storeAdminAppToken } from "@/utils/admin-token";

const route = useRoute();
const router = useRouter();
const store = useStore();
const urqlClientHandle = useClientHandle();

async function main() {
  if (route.query.error) {
    router.push({ name: "AdminAppTokenError" });
    return;
  }

  const code = route.query.code;
  if (!code) {
    router.push({ name: "Entry" });
    return;
  }

  const state = route.query.state;
  try {
    await storeAdminAppToken(code, state, urqlClientHandle.client);
  } catch (error) {
    // console.log(error);
    router.push({ name: "AdminAppTokenError" });
    return;
  }
  store.setSnackbarMessage("Admin App Token stored");
  router.push({ name: "AdminUser" });
}

onMounted(async () => {
  await main();
});
</script>

<style scoped>
.g-container {
  display: grid;
  block-size: 100%;
  place-items: center;
}
</style>
