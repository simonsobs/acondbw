<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <sign-in-card></sign-in-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import SignInCard from "@/components/auth/SignInCard.vue";

export default Vue.extend({
  name: "SignIn",
  components: {
    SignInCard,
  },
  data: () => ({}),
});
</script>
