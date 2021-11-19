<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Edit
        <span class="font-italic"> {{ node.name }} </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error"> {{ error }} </v-alert>
    </v-card-text>
    <v-card flat class="px-3">
      <v-divider class="mb-5"></v-divider>
      <form-start
        v-model="value"
        :productType="node.type_"
        @valid="valid = $event"
      ></form-start>
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
import { camelCase } from "camel-case";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";
import FormStart from "./FormStart.vue";

export default {
  name: "ProductEditForm",
  components: {
    FormStart,
  },
  props: {
    node: Object,
    attributes: Object,
  },
  data() {
    const initialValue = {
      name: this.node.name,
      dateProduced: this.attributes["date_produced"].value,
      producedBy: this.attributes["produced_by"].value,
      contact: this.attributes["contact"].value,
      paths: this.node.paths.edges.map(({ node }) => node.path).join("\n"),
      note: this.node.note,
    };
    return {
      initialValue,
      value: { ...initialValue },
      valid: false,
      error: null,
    };
  },
  computed: {
    fields() {
      const ret = this.node.type_.fields.edges.reduce(
        (a, { node }) => ({
          ...a,
          ...{
            [camelCase(node.field.name)]: node,
          },
        }),
        {}
      );
      return ret;
    },
    unchanged() {
      return JSON.stringify(this.value) === JSON.stringify(this.initialValue);
    },
    input() {
      if (!this.valid) return null;
      return this.composeUpdateProductInput(this.value, this.initialValue);
    },
  },
  watch: {},
  methods: {
    composeUpdateProductInput(value, initialValue) {
      const ret = {};
      if (value.name != initialValue.name) ret.name = value.name;
      if (value.note != initialValue.note) ret.note = value.note;

      if (value.paths != initialValue.paths)
        ret.paths = value.paths
          .split("\n")
          .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
          .filter(Boolean) // remove empty strings
          .filter((v, i, a) => a.indexOf(v) === i); // unique

      const keys = ["contact", "dateProduced", "producedBy"].filter(
        (k) => value[k] != initialValue[k] && k in this.fields
      );
      if (!!keys.length)
        ret.attributes = keys.reduce((a, k) => {
          const typeName = camelCase(this.fields[k].field.type_);
          a[typeName] = a[typeName] ? a[typeName] : [];
          a[typeName].push({
            fieldId: this.fields[k].fieldId,
            value: value[k],
          });
          return a;
        }, {});

      return ret;
    },
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
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
};
</script>
