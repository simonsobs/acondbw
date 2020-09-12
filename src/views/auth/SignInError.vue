<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card flat>
        <v-card-title>Unsuccessful</v-card-title>
        <v-card-actions>
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
  methods: {
    tryAgain() {
      this.$router.push({ name: "SignIn" });
    }
  }
};
</script>
