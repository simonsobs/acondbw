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

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

import { validateState, decodeState } from "@/utils/auth/oauth";

export default Vue.extend({
  name: "Auth",
  data: () => ({}),
  methods: {
    async main() {
      const state = this.$route.query.state;
      if (!(typeof state === "string" && validateState(state))) {
        this.$router.push({ path: "/" });
        return;
      }

      if (this.$route.query.error) {
        this.setRequestAuthError(this.$route.query);
        this.$router.push({ name: "SignInError" });
        return;
      }

      const code = this.$route.query.code;
      if (!(typeof code === "string" && code)) {
        this.$router.push({ name: "Entry" });
        return;
      }

      try {
        await this.signIn(code, state, this.$apollo);
      } catch (error) {
        this.$router.push({ name: "SignInError" });
        return;
      }
      const rawState = decodeState(state);
      const { path } = JSON.parse(rawState.option);
      this.setSnackbarMessage("Signed in");
      await this.$router.push(path);
    },
    ...mapActions(useStore, ["setSnackbarMessage"]),
    ...mapActions(useAuthStore, ["setRequestAuthError", "signIn"]),
  },
  mounted: async function () {
    await this.main();
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
