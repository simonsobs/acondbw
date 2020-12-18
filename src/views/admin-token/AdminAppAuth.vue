<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="grey"
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { storeAdminAppToken } from "@/utils/admin-token.js"

export default {
  name: "AdminAppAuth",
  data: () => ({}),
  methods: {
    async main() {
      if (this.$route.query.error) {
        this.$router.push({ name: "AdminAppTokenError" });
        return;
      }

      const code = this.$route.query.code;
      if (!code) {
        this.$router.push({ path: "/" });
        return;
      }

      const state = this.$route.query.state;
      try {
        await storeAdminAppToken(code, state, this.$apollo);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "AdminAppTokenError" });
        return;
      }
      this.$store.dispatch("snackbarMessage", "Admin App Token stored");
      this.$router.push({ name: "Dashboard" });
    },
  },
  mounted: async function () {
    this.main();
  },
};
</script>
