<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="secondary"
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { validateState } from "@/utils/auth";

export default Vue.extend({
  name: "OAuthRedirect",
  methods: {
    async main() {
      const state = this.$route.query.state;

      if (!(typeof state === "string" && this.isValid(state))) {
        this.$router.push({ path: "/" });
        return;
      }

      this.redirect(state);
    },
    isValid(state: string) {
      if (!state) return false;
      if (!validateState(state)) return false;
      return true;
    },
    redirect(state: string) {
      const jsonString = atob(state);
      const parsed = JSON.parse(jsonString);
      // e.g.,
      //   parsed = {
      //     redirect: { name: "Auth" },
      //     code: "XXXXXXXX",
      //   };

      const redirect = { ...parsed.redirect, query: this.$route.query };
      // e.g.,
      //   redirect = {
      //     name: "Auth",
      //     query: {
      //       code: "XXXXXXXX",
      //       state: "XXXXXXXXXXXXXXXX"
      //     }
      //   }

      this.$router.push(redirect);
    },
  },
  mounted: async function () {
    this.main();
  },
});
</script>
