<template>
  <v-card>
    <v-card-title>
      Change the name of the {{ node.type_.singular }}
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      Current name: {{ node.name }}
      <v-text-field
        label="New name"
        v-model="newName"
        :error-messages="newNameErrors"
        @input="$v.newName.$touch()"
        @blur="$v.newName.$touch()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="primary" :disabled="$v.$invalid" text @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import gql from "graphql-tag";

import { required } from "vuelidate/lib/validators";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";

async function isNameAvailable(name, productTypeId, apolloClient) {
  const QUERY = gql`
    query QueryProductNameInProductChangeNameForm(
      $typeId: Int!
      $name: String!
    ) {
      product(typeId: $typeId, name: $name) {
        productId
        typeId
        name
      }
    }
  `;

  const { data } = await apolloClient.query({
    query: QUERY,
    variables: {
      typeId: productTypeId,
      name: name,
    },
  });

  if (data.product) {
    // the name isn't available
    return false;
  }

  return true;
}

export default {
  name: "ProductChangeNameForm",
  props: {
    node: Object,
  },
  data: () => ({
    newName: "",
    error: null,
  }),
  validations: {
    newName: {
      required,
      async unique(value) {
        if (value === "") return true;
        try {
          return await isNameAvailable(
            value.trim(),
            this.node.typeId,
            this.$apollo
          );
        } catch (error) {
          this.error = error;
          return true;
        }
      },
    },
  },
  computed: {
    newNameErrors() {
      const errors = [];
      const field = this.$v.newName;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.unique &&
        errors.push(`The name "${field.$model.trim()}" is not available.`);
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
      this.newName = "";
      this.$v.$reset();
      this.error = null;
    },
    async submit() {
      try {
        const updateProductInput = {
          name: this.newName,
        };
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
            input: updateProductInput,
          },
        });

        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Changed");
        this.$emit("finished", this.newName);
        this.delayedReset();
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>
