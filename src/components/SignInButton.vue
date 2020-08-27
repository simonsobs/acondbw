<template>
  <v-btn outlined :disabled="disabled" :to="to">Sign In</v-btn>
</template>

<script>
export default {
  name: "SignInButton",
  data: () => ({}),
  computed: {
    pathToSignIn() {
      return this.$router.resolve({ name: "SignIn" }).route.path;
      // i.e., "/signin"
    },
    disabled() {
      const currentPath = this.$route.path;
      return currentPath == this.pathToSignIn;
    },
    to() {
      return this.disabled ? null : this.pathToSignIn;
    }
  }
};
</script>
