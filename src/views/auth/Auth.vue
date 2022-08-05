<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="primary"
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import { validateState } from "@/utils/auth";

export default Vue.extend({
  name: "Auth",
  data: () => ({}),
  methods: {
    async main() {
      const state = this.$route.query.state;
      if (!validateState(state)) {
        this.$router.push({ path: "/" });
        return;
      }

      if (this.$route.query.error) {
        this.$store.dispatch("setRequestAuthError", this.$route.query);
        this.$router.push({ name: "SignInError" });
        return;
      }

      const code = this.$route.query.code;
      if (!code) {
        this.$router.push({ path: "/" });
        return;
      }

      try {
        await this.$store.dispatch("signIn", {
          code,
          state,
          apolloClient: this.$apollo,
        });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
        return;
      }
      this.setSnackbarMessage("Signed in");
      this.$router.push({ name: "Dashboard" });
    },
    ...mapActions(useStore, ["setSnackbarMessage"]),
  },
  mounted: async function () {
    this.main();
  },
});
</script>
