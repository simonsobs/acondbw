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
import { validateAndDecodeState } from "@/utils/auth/oauth";

const route = useRoute();
const router = useRouter();

async function main() {
  const locationOnError = { name: "Entry" };

  const state = route.query.state;

  let rawState: ReturnType<typeof validateAndDecodeState>;
  if (!(rawState = validateAndDecodeState(state))) {
    await router.push(locationOnError);
    return;
  }
  // e.g.,
  //   rawState = {
  //     redirect: { name: "Auth" },
  //     option: "XXXXXXXX",
  //   };

  const redirect = { ...rawState.redirect, query: route.query };
  // e.g.,
  //   redirect = {
  //     name: "Auth",
  //     query: {
  //       code: "XXXXXXXX",
  //       state: "XXXXXXXXXXXXXXXX"
  //     }
  //   }

  await router.push(redirect);
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
