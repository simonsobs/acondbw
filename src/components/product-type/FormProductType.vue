<template>
  <div>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-text-field
            outlined
            label="Name (plural)*"
            required
            :hint="pluralHint"
            persistent-hint
            v-model="$v.form.plural.$model"
            :error-messages="pluralErrors"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="10" class="pa-0">
          <v-container pa-0>
            <v-row class="ma-0">
              <v-col cols="12" md="12">
                <v-radio-group
                  label="Indefinite article for singular"
                  id="radio-group-indef-article"
                  class="mt-0"
                  :value="$v.form.indefArticle.$model"
                  @change="fixForEmptyString($v.form.indefArticle, $event)"
                  :hint="indefArticleHint"
                  persistent-hint
                  row
                >
                  <v-radio
                    v-for="(item, index) in indefArticleItems"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  outlined
                  label="Name (singular)*"
                  required
                  :hint="singularHint"
                  persistent-hint
                  :prefix="$v.form.indefArticle.$model"
                  v-model="$v.form.singular.$model"
                  :error-messages="singularErrors"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="10">
          <v-text-field
            outlined
            label="Name (snake case)*"
            required
            :hint="nameHint"
            persistent-hint
            v-model="$v.form.name.$model"
            :error-messages="nameErrors"
          >
            <template v-slot:message="{ message }">
              <span v-html="message"></span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="10">
          <v-autocomplete
            outlined
            label="icon"
            :items="iconItems"
            :hint="iconHint"
            persistent-hint
            v-model="$v.form.icon.$model"
            :prepend-icon="$v.form.icon.$model"
          >
            <template v-slot:item="data">
              <v-icon class="me-3"> {{ data.item }} </v-icon>
              {{ data.item }}
            </template>
            <template v-slot:message="{ message }">
              <span v-html="message"></span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="10">
          <v-text-field
            outlined
            label="Order"
            :hint="orderHint"
            persistent-hint
            v-model="$v.form.order.$model"
            :error-messages="orderErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          :disabled="!$v.form.$anyDirty"
          text
          @click="reset"
        >
          Reset
        </v-btn>
      </v-card-actions>
    </v-container>
  </div>
</template>

<script>
import { required, integer } from "vuelidate/lib/validators";

import { mdIcons } from "@/utils/md-icons";

const iconItems = mdIcons.map(({ name }) => `mdi-${name}`);

export default {
  name: "FormProductType",
  props: {
    value: Object,
  },
  data() {
    const formDefault = {
      name: "",
      order: null,
      indefArticle: "",
      singular: "",
      plural: "",
      icon: "mdi-chart-gantt",
    };
    const formReset = { ...formDefault, ...(this.value || {}) };
    return {
      formReset,
      form: { ...formReset },
      pluralHint:
        'Product type name in the plural form, e.g., "maps". ' +
        "If the plural form does not exist, use the singular form. " +
        "White spaces can be included. " +
        "Use all lowercase unless the word is usually written in uppercase. " +
        "It will be capitalized automatically when rendered if appropriate. ",
      indefArticleHint:
        "The indefinite article to be placed before the singular form of the product type name.",
      indefArticleItems: [
        { text: "a", value: "a" },
        { text: "an", value: "an" },
        { text: "(none)", value: "" },
      ],
      singularHint:
        'Product type name in the singular form, e.g., "map". ' +
        "White spaces can be included. " +
        "Use all lowercase unless the word is usually written in uppercase. " +
        "It will be capitalized automatically when rendered if appropriate. ",
      nameHint:
        "Name of the product type in the " +
        '<a href="https://en.wikipedia.org/wiki/Snake_case" target="_blank">snake case</a> ' +
        "Use the singular name with all white spaces replaced with underscores if possible. ",
      iconHint:
        "Icon for the product type. " +
        "Choose from material design icons: " +
        '<a href="https://pictogrammers.github.io/@mdi/font/6.3.95/" target="_blank">materialdesignicons.com/</a>',
      iconItems,
      orderHint:
        "The product types are laid out in the ascending order of these values " +
        "when relevant, e.g., in the sidebar navigation.",
    };
  },
  validations: {
    form: {
      name: { required },
      order: { integer },
      indefArticle: {},
      singular: { required },
      plural: { required },
      icon: {},
    },
  },
  computed: {
    nameErrors() {
      const field = this.$v.form.name;
      const errors = [];
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
    singularErrors() {
      const field = this.$v.form.singular;
      const errors = [];
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
    pluralErrors() {
      const field = this.$v.form.plural;
      const errors = [];
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
    orderErrors() {
      const field = this.$v.form.order;
      const errors = [];
      if (!field.$dirty) return errors;
      !field.integer && errors.push("Must be an integer value");
      return errors;
    },
    valid() {
      return !this.$v.$invalid;
    },
  },
  watch: {
    value: {
      handler() {
        if (JSON.stringify(this.value) === JSON.stringify(this.form)) return;
        this.form = { ...this.formReset, ...(this.value || {}) };
      },
      deep: true,
    },
    form: {
      handler() {
        // if (this.$v.$invalid) return;
        this.$emit("input", { ...this.form });
      },
      deep: true,
      immediate: true,
    },
    valid: {
      handler(val) {
        this.$emit("valid", val);
      },
      immediate: true,
    },
  },
  methods: {
    fixForEmptyString(field, value) {
      // v-raio returns 2 when the value is "" (empty string)
      // This might be a bug of Vuetify.
      const fixedValue = this.indefArticleItems
        .map(({ value }) => value)
        .includes(value)
        ? value
        : "";
      field.$model = fixedValue;
      field.$touch();
    },
    reset() {
      this.form = { ...this.formReset };
      this.$v.$reset();
    },
  },
};
</script>

<style>
legend#radio-group-indef-article {
  width: 100%;
  margin-bottom: 4px;
}
</style>
