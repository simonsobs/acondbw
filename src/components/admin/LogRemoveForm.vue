<template>
  <v-card>
    <v-card-title class="headline">Remove</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-card-text>
    <v-card-text class="body-1 font-weight-medium error--text"
      >Really, remove?</v-card-text
    >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="error" text @click="remove">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import DELETE_LOG from "@/graphql/mutations/DeleteLog.gql";

export default Vue.extend({
  name: "LogRemoveForm",
  props: {
    id_: Number,
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
        const { data } = await this.$apollo.mutate({
          mutation: DELETE_LOG,
          variables: { id_: this.id_ },
        });
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
