<template>
  <v-card>
    <v-card-title>Add a GitHub organization</v-card-title>
    <v-card-text>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="login"
              label="GitHub organization account name"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="primary" text @click="add">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ADD_GITHUB_ORG from "@/graphql/mutations/AddGitHubOrg.gql";

export default {
  name: "GitHubOrgAddForm",
  data: () => ({
    login: "",
    error: null,
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
      this.delayedReset();
    },
    delayedReset() {
      // reset 0.5 sec after so that the reset form won't be shown.
      setTimeout(() => {
        this.reset();
      }, 500);
    },
    reset() {
      this.login = "";
      this.error = null;
    },
    async add() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADD_GITHUB_ORG,
          variables: { login: this.login },
        });
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Added");
        this.$emit("finished");
      } catch (error) {
        console.log(error);
        this.error = error;
      }
    },
  },
};
</script>
