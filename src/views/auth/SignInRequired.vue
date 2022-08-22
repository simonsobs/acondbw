<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col class="text-h3 text-center">
        <div>Sign-in required</div>
        <v-btn class="mt-5" outlined :to="{ name: 'SignIn' }">
          Go to the sign-in page
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SignInRequired",
});
</script>
