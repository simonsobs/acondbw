<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="grey"
  ></v-progress-circular>
  <v-card flat v-else>
    <v-card-title>Sign In</v-card-title>
    <v-card-actions>
      <v-btn block outlined @click="signIn">
        <v-icon left>mdi-github</v-icon>Sign In with GitHub
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SignInCard",
  data: () => ({
    loading: false,
  }),
  methods: {
    async signIn() {
      this.loading = true;
      try {
        await this.$store.dispatch("requestAuth", {
          window,
          apolloClient: this.$apollo,
        });
      } catch (error) {
        this.$router.push({ name: "SignInError" });
      }
    },
  },
};
</script>
