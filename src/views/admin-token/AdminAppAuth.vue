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
import { defineComponent } from "vue"
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import { storeAdminAppToken } from "@/utils/admin-token";

import { client } from "@/plugins/urql"

export default defineComponent({
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
        await storeAdminAppToken(code, state, client);
      } catch (error) {
        // console.log(error);
        this.$router.push({ name: "AdminAppTokenError" });
        return;
      }
      this.setSnackbarMessage("Admin App Token stored");
      this.$router.push({ name: "AdminUser" });
    },
    ...mapActions(useStore, ["setSnackbarMessage"]),
  },
  mounted: async function () {
    this.main();
  },
});
</script>
