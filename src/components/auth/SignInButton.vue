<template>
  <span>
    <span v-if="token && user">
      <v-menu bottom offset-y v-model="menu">
        <template v-slot:activator="{ on, attr }">
          <v-btn icon class="no-uppercase" v-bind="attr" v-on="on">
            <v-avatar size="36">
              <img :src="user.avatarUrl" :alt="user.login" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.login }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon left>mdi-github</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-divider></v-divider>
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Sign Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <sign-out-confirmation v-on:finished="dialog = false; menu = false"></sign-out-confirmation>
          </v-dialog>
        </v-list>
      </v-menu>
    </span>
    <v-btn v-if="!token" depressed :to="pathToSignIn">
      <v-icon left>mdi-github</v-icon>
      Sign In
    </v-btn>
  </span>
</template>

<script>
import GitHubUser from "@/graphql/auth/GitHubUser.gql";
import SignOutConfirmation from "./SignOutConfirmation";

export default {
  name: "SignInButton",
  components: { SignOutConfirmation },
  data: () => ({
    githubUser: null,
    menu: false,
    dialog: false
  }),
  apollo: {
    githubUser: {
      query: GitHubUser,
      skip: function() {
        return !this.token;
      },
      result(result) {
        if (!result.data || !result.data.githubUser) {
          this.$store.dispatch("unsetToken");
          return;
        }
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    user() {
      if (!this.token) {
        return null;
      } else if (!this.githubUser) {
        return null;
      } else {
        return this.githubUser;
      }
    },
    pathToSignIn() {
      return this.$router.resolve({ name: "SignIn" }).route.path;
      // i.e., "/signin"
    }
  },
  watch: {
    token: function() {
      if (!this.token) return;
      this.$apollo.queries.githubUser.refetch();
    }
  }
};
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>