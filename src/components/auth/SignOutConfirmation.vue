<template>
  <div class="sign-out-confirmation" style="position: relative;">
    <v-card class="pa-3">
      <v-card-title class="headline">Sign Out</v-card-title>
      <v-card-text class="body-1 font-weight-medium">Really, sign out?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="primary" @click="signOut">Sign Out</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SignOutConfirmation",
  methods: {
    async signOut() {
      this.$store.dispatch("unsetToken", this.$apollo);
      this.$emit("finished");
      this.$store.dispatch("snackbarMessage", "Signed out");

      const to = { name: "Home" }
      if (this.$route.path == this.$router.resolve(to).route.path) {
        // to avoid NavigationDuplicated
        return;
      }
      this.$router.push(to);
    }
  }
};
</script>
