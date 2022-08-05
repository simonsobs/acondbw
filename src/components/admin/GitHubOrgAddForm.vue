<template>
  <v-card>
    <v-card-title>Add a GitHub organization</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="GitHub organization account name"
              v-model="login"
              :error-messages="loginErrors"
              @input="$v.login.$touch()"
              @blur="$v.login.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
      <v-btn color="primary" :disabled="$v.$invalid" text @click="add"
        >Add</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import { required } from "vuelidate/lib/validators";

import ADD_GITHUB_ORG from "@/graphql/mutations/AddGitHubOrg.gql";

export default Vue.extend({
  name: "GitHubOrgAddForm",
  data: () => ({
    login: "",
    error: null as any,
  }),
  validations: { login: { required } },
  computed: {
    loginErrors() {
      const errors: string[] = [];
      const field = this.$v.login;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
  },
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
      this.$v.$reset();
      this.error = null;
    },
    async add() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADD_GITHUB_ORG,
          variables: { login: this.login },
        });
        this.apolloMutationCalled();
        this.setSnackbarMessage("Added");
        this.$emit("finished");
        this.delayedReset();
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
