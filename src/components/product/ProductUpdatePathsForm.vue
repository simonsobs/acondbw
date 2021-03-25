<template>
  <v-card>
    <v-card-title
      >Update the paths of the {{ node.type_.singular }}
      {{ node.name }}</v-card-title
    >
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-textarea
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
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
      <v-btn color="primary" :disabled="unchanged" text @click="submit"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { required } from "vuelidate/lib/validators";

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

export default {
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

        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Changed");
        this.$emit("finished");
        this.delayedReset();
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>