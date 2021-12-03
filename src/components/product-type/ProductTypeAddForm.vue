<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Add a
        <span class="font-italic"> product type </span>
      </span>
    </v-card-title>
    <v-card flat class="px-3">
      <v-divider class="mb-5"></v-divider>
      <form-product-type v-model="value" @valid="valid = $event">
      </form-product-type>
      <v-divider></v-divider>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn
        color="primary"
        :disabled="unchanged || !valid"
        text
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CREATE_PRODUCT_TYPE from "@/graphql/mutations/CreateProductType.gql";

import FormProductType from "./FormProductType.vue";

export default {
  name: "ProductTypeAddForm",
  components: { FormProductType },
  data() {
    const initialValue = {
      name: "",
      order: 1,
      indefArticle: "a",
      singular: "",
      plural: "",
      icon: "mdi-beaker-question-outline",
    };
    return {
      initialValue,
      value: { ...initialValue },
      valid: false,
    };
  },
  computed: {
    unchanged() {
      return JSON.stringify(this.value) === JSON.stringify(this.initialValue);
    },
    input() {
      if (!this.valid) return null;
      return this.composeInput(this.value, this.initialValue);
    },
  },
  methods: {
    composeInput(value, initialValue) {
      const ret = { ...value };
      return ret;
    },
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: CREATE_PRODUCT_TYPE,
          variables: {
            input: this.input,
          },
        });
        this.$apollo.provider.defaultClient.cache.data.data = {};
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Added");
        this.$emit("finished", this.input.name);
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>
