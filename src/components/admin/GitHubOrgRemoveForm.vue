<template>
  <v-card>
    <v-card-title class="headline">Remove</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-card-text>
    <v-card-text class="body-1 font-weight-medium error--text"
      >Really, remove "{{ login }}" ?</v-card-text
    >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="error" text @click="remove">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import { client } from "@/plugins/urql";

import DELETE_GITHUB_ORG from "@/graphql/mutations/DeleteGitHubOrg.gql";

export default defineComponent({
  name: "GitHubOrgRemoveForm",
  props: {
    login: String,
  },
  data: () => ({
    error: null as any,
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
      this.error = null;
    },
    async remove() {
      try {
        const result = await client
          .mutation(DELETE_GITHUB_ORG, { login: this.login })
          .toPromise();
        if (result.error) throw result.error;
        this.apolloMutationCalled();
        this.setSnackbarMessage("Removed");
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
