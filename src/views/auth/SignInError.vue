<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card flat min-width="250px">
        <v-card-title>Sign In Unsuccessful</v-card-title>
        <v-card-text v-if="error">
          <v-alert type="error" outlined>
            <strong v-if="error.error">{{ error.error }}:</strong>
            <span v-if="error.error_description">
              {{ error.error_description }}</span
            ><v-btn
              v-if="error.error_uri"
              icon
              small
              color="error"
              :href="error.error_uri"
              target="_blank"
              ><v-icon small>mdi-open-in-new</v-icon></v-btn
            >
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn outlined to="/">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn outlined @click="tryAgain">Try again</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SignInError",
  computed: {
    error() {
      const auth = this.$store.state.auth;
      if (auth) {
        return auth.lastError;
      } else {
        return null;
      }
    },
  },
  methods: {
    tryAgain() {
      this.$router.push({ name: "SignIn" });
    },
  },
};
</script>
