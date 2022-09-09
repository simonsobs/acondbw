<template>
  <div class="sign-out-confirmation" style="position: relative">
    <v-card class="pa-3">
      <v-card-title class="headline">Sign Out</v-card-title>
      <v-card-text class="body-1 font-weight-medium"
        >Really, sign out?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="primary" @click="callSignOut">Sign Out</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

export default Vue.extend({
  name: "SignOutConfirmation",
  methods: {
    async callSignOut() {
      await this.signOut();
      this.$emit("finished");
      this.setSnackbarMessage("Signed out");

      const to = { name: "Entry" };
      if (this.$route.path == this.$router.resolve(to).route.path) {
        // to avoid NavigationDuplicated
        return;
      }
      this.$router.push(to);
    },
    ...mapActions(useStore, ["setSnackbarMessage"]),
    ...mapActions(useAuthStore, ["signOut"]),
  },
});
</script>
