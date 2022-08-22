<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col class="text-h3 text-center">
        <div>Sign-in required</div>
        <v-btn v-if="isSignedIn" class="mt-5" outlined to="/">
          Go to the entry page
        </v-btn>
        <v-btn v-else class="mt-5" outlined :to="{ name: 'SignIn' }">
          Go to the sign-in page
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default Vue.extend({
  name: "SignInRequired",
  data() {
    return {};
  },
  computed: {
    ...mapState(useAuthStore, ["isSignedIn"]),
  },
});
</script>
