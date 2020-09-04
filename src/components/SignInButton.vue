<template>
  <span>
    <span v-if="token && username">
      <v-menu bottom offset-y v-model="menu">
        <template v-slot:activator="{ on, attr }">
          <v-btn text class="no-uppercase" v-bind="attr" v-on="on">{{ username }}</v-btn>
        </template>
        <v-list>
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
    <v-btn v-if="!token" outlined :disabled="disabled" :to="to">Sign In</v-btn>
  </span>
</template>

<script>
import GitHubUsername from "@/graphql/GitHubUsername.gql";
import SignOutConfirmation from "@/components/SignOutConfirmation";

export default {
  name: "SignInButton",
  components: { SignOutConfirmation },
  data: () => ({
    githubUsername: null,
    menu: false,
    dialog: false
  }),
  apollo: {
    githubUsername: {
      query: GitHubUsername,
      variables() {
        return {
          token: this.token
        };
      },
      skip: function() {
        return !this.token;
      },
      result(result) {
        if (!result.data.githubUsername) {
          this.$store.dispatch("unsetToken");
          return;
        }
      }
    }
  },
  created() {
    if (localStorage.token && localStorage.token != "null") {
      this.$store.dispatch("setToken", localStorage.token);
    }
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    username() {
      if (!this.token) {
        return null;
      } else if (!this.githubUsername) {
        return null;
      } else {
        return this.githubUsername;
      }
    },
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
  },
  watch: {
    token: function() {
      if (!this.token) return;
      this.$apollo.queries.githubUsername.refetch();
    }
  }
};
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>