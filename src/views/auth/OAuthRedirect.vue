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

<script lang="ts">
import Vue from "vue";
import { validateAndDecodeState } from "@/utils/auth/oauth";

export default Vue.extend({
  name: "OAuthRedirect",
  async mounted() {
    const route = this.$route;
    const router = this.$router;
    const locationOnError = { path: "/" };

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
  },
});
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
