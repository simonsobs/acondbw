<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <sign-in-card></sign-in-card>
    </v-row>
  </v-container>
</template>

<script>
import SignInCard from "@/components/auth/SignInCard";

export default {
  name: "SignIn",
  components: {
    SignInCard,
  },
  data: () => ({}),
};
</script>
