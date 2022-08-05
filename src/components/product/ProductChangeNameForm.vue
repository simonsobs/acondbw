<template>
  <v-card>
    <v-card-title class="primary--text">
      Rename the {{ node.type_.singular }}
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      Current name: {{ node.name }}
    </v-card-text>
    <v-card-text>
      <v-text-field
        outlined
        label="New name"
        v-model="newName"
        :error-messages="newNameErrors"
        @input="$v.newName.$touch()"
        @blur="$v.newName.$touch()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="primary" :disabled="$v.$invalid" text @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

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
    fetchPolicy: "network-only",
  });

  if (data.product) return false;
  return true;
}

export default Vue.extend({
  name: "ProductChangeNameForm",
  props: {
    node: Object,
  },
  data() {
    return {
      newName: "",
      error: null as any,
    };
  },
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
      const errors: string[] = [];
      const field = this.$v.newName;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.unique &&
        errors.push(`The name "${field.$model.trim()}" is not available.`);
      return errors;
    },
  },
  methods: {
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

        this.apolloMutationCalled();
        this.setSnackbarMessage("Changed");
        this.$emit("finished", this.newName);
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
