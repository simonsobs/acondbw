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
import { onRedirectedBack } from "@/utils/auth";

export default Vue.extend({
  name: "OAuthRedirect",
  async mounted() {
    const route = this.$route;
    const router = this.$router;
    const locationOnError = { path: "/" };
    await onRedirectedBack(route, router, locationOnError);
  },
});
</script>
