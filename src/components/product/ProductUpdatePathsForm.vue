<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Update the paths of
        <span class="font-italic">{{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-textarea
        outlined
        label="Paths"
        hint="A path per line. e.g., nersc:/go/to/my/product_v3"
        rows="5"
        persistent-hint
        v-model="model"
        :error-messages="modelErrors"
        @input="$v.model.$touch()"
        @blur="$v.model.$touch()"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel</v-btn>
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
import { defineComponent } from "vue"
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";

function composeInitialModel(node) {
  return node.paths.edges.map((e) => e.node.path).join("\n");
}

function composeInputPaths(text) {
  return text
    .split("\n")
    .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
    .filter(Boolean) // remove empty strings
    .filter((v, i, a) => a.indexOf(v) === i); // unique
}

export default defineComponent({
  name: "ProductUpdatePathsForm",
  props: {
    node: Object,
  },
  data() {
    return {
      model: composeInitialModel(this.node),
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
      return composeInitialModel(this.node);
    },
    unchanged() {
      return this.model == this.initialModel;
    },
  },
  methods: {
    reset() {
      this.model = this.initialModel;
      this.$v.$reset();
      this.error = null;
    },
    async submit() {
      try {
        const updateProductInput = { paths: composeInputPaths(this.model) };
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
