<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <sign-in-card></sign-in-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SignInCard from "@/components/auth/SignInCard.vue";

export default defineComponent({
  name: "SignIn",
  components: {
    SignInCard,
  },
  data: () => ({}),
});
</script>
