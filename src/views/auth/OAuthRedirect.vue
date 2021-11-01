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

<script>
import { validateState } from "@/utils/auth.js";

export default {
  name: "OAuthRedirect",
  data: () => ({}),
  methods: {
    async main() {
      let state = this.$route.query.state;
      if (!state) {
        this.$router.push({ path: "/" });
        return;
      }

      if (!validateState(state)) {
        this.$router.push({ path: "/" });
        return;
      }

      state = JSON.parse(atob(state));
      // e.g.,
      //   state = {
      //     redirect: { name: "Auth" },
      //     code: "XXXXXXXX",
      //   };

      const redirect = { ...state.redirect, query: this.$route.query };
      // e.g.,
      //   redirect = {
      //     name: "Auth",
      //     query: {
      //       code: "XXXXXXXX",
      //       state: "XXXXXXXXXXXXXXXX"
      //     }
      //   }

      this.$router.push(redirect);
      return;
    },
  },
  mounted: async function () {
    this.main();
  },
};
</script>
