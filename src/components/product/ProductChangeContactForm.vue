<template>
  <v-card>
    <v-card-title class="primary--text">
      <span
        >Change the {{ attribute.name }} of
        <span class="font-italic">{{ node.name }}</span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      Current contact: {{ attribute.value }}
    </v-card-text>
    <v-card-text>
      <v-text-field
        outlined
        label="New contact"
        v-model="newContact"
        :error-messages="newContactErrors"
        @input="$v.newContact.$touch()"
        @blur="$v.newContact.$touch()"
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

import { required } from "vuelidate/lib/validators";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";

export default Vue.extend({
  name: "ProductChangeContactForm",
  props: {
    node: Object,
    attribute: Object,
  },
  data() {
    return {
      newContact: "",
      error: null as any,
    };
  },
  validations: { newContact: { required } },
  computed: {
    newContactErrors() {
      const errors: string[] = [];
      const field = this.$v.newContact;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
  },
  methods: {
    async submit() {
      try {
        const updateProductInput = {
          contact: this.newContact,
          attributes: {
            unicodeText: [
              { fieldId: this.attribute.fieldId, value: this.newContact },
            ],
          },
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
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
