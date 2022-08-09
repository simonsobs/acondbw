<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Edit the note for <span class="font-italic"> {{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-tabs v-model="tab" class="mb-1">
        <v-tab key="edit">Edit</v-tab>
        <v-tab key="preview">Preview</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          key="edit"
          style="min-height: 180px"
          :transition="false"
          :reverse-transition="false"
        >
          <v-textarea
            solo
            outlined
            label="Note will be parsed as Markdown"
            rows="5"
            v-model="model"
            :error-messages="modelErrors"
            @input="$v.model.$touch()"
            @blur="$v.model.$touch()"
          ></v-textarea>
        </v-tab-item>
        <v-tab-item
          key="preview"
          v-html="preview"
          style="min-height: 180px"
          :transition="false"
          :reverse-transition="false"
          class="markdown-body pt-3"
        >
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="secondary" :disabled="unchanged" text @click="reset">
        Reset
      </v-btn>
      <v-btn color="primary" :disabled="unchanged" text @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import marked from "marked";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";

export default Vue.extend({
  name: "ProductEditNoteForm",
  props: {
    node: Object,
  },
  data() {
    return {
      model: this.node.note,
      tab: null,
      error: null,
    };
  },
  validations: { model: {} },
  computed: {
    modelErrors() {
      const errors = [];
      const field = this.$v.model;
      if (!field.$dirty) return errors;
      return errors;
    },
    initialModel() {
      return this.node.note;
    },
    unchanged() {
      return this.model == this.initialModel;
    },
    preview() {
      return this.model ? marked(this.model) : "<em>Nothing to preview</em>";
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
      this.delayedReset();
    },
    reset() {
      this.model = this.initialModel;
      this.$v.$reset();
      this.tab = null;
      this.error = null;
    },
    async submit() {
      try {
        const updateProductInput = { note: this.model };
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
            input: updateProductInput,
          },
        });

        this.apolloMutationCalled();
        this.setSnackbarMessage("Changed");
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
