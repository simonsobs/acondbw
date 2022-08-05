<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Change the settings of the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
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

<script lang="ts">
import Vue from "vue";
import UPDATE_PRODUCT_TYPE from "@/graphql/mutations/UpdateProductType.gql";

import FormProductType from "./FormProductType.vue";

export default Vue.extend({
  name: "ProductTypeEditForm",
  components: { FormProductType },
  props: {
    node: Object,
  },
  data() {
    const initialValue = {
      name: this.node.name,
      order: this.node.order,
      indefArticle: this.node.indefArticle,
      singular: this.node.singular,
      plural: this.node.plural,
      icon: this.node.icon,
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
      const ret = {};
      if (value.name != initialValue.name) ret.name = value.name;
      if (value.order != initialValue.order) ret.order = value.order;
      if (value.indefArticle != initialValue.indefArticle)
        ret.indefArticle = value.indefArticle;
      if (value.singular != initialValue.singular)
        ret.singular = value.singular;
      if (value.plural != initialValue.plural) ret.plural = value.plural;
      if (value.icon != initialValue.icon) ret.icon = value.icon;
      return ret;
    },
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_TYPE,
          variables: {
            typeId: this.node.typeId,
            input: this.input,
          },
        });
        this.$apollo.provider.defaultClient.cache.data.data = {};
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Updated");
        this.$emit("finished", this.input.name);
      } catch (error) {
        this.error = error;
      }
    },
  },
});
</script>
