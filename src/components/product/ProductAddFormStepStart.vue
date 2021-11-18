<template>
  <v-form ref="form">
    <v-container fluid>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-row justify="center">
        <v-col order="1" cols="12" md="10">
          <v-text-field
            outlined
            label="Name*"
            required
            :hint="`Name of the ${productType.singular}.`"
            persistent-hint
            :error-messages="nameErrors"
            :value="$v.form.name.$model"
            @input="debounceInput($v.form.name, $event)"
            @blur="$v.form.name.$touch()"
          ></v-text-field>
        </v-col>
        <v-col order="3" cols="12" md="10">
          <v-text-field-with-date-picker
            outlined
            label="Date produced (YYYY-MM-DD)*"
            required
            :hint="`The date on which the ${productType.singular} was produced, e.g., 2020-05-06. In the current version of the product DB, this field cannot be changed once the ${productType.singular} is added. It will be possible to change in a future version.`"
            persistent-hint
            v-model="$v.form.dateProduced.$model"
            :error-messages="dateProducedErrors"
          ></v-text-field-with-date-picker>
        </v-col>
        <v-col order="4" cols="12" md="10">
          <v-text-field
            outlined
            label="Produced by*"
            required
            :hint="`The person or group that produced the ${productType.singular}, e.g. pwg-xxx. In the current version of the product DB, this field cannot be changed once the ${productType.singular} is added. It will be possible to change in a future version.`"
            persistent-hint
            v-model="$v.form.producedBy.$model"
            :error-messages="producedByErrors"
          ></v-text-field>
        </v-col>
        <v-col order="5" cols="12" md="10">
          <v-text-field
            outlined
            label="Contact*"
            required
            :hint="`A person or group that can be contacted for questions or issues about the ${productType.singular}.`"
            persistent-hint
            v-model="$v.form.contact.$model"
            :error-messages="contactErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-textarea
            outlined
            label="Paths"
            hint="A path per line. e.g., nersc:/go/to/my/product_v3"
            rows="4"
            persistent-hint
            v-model="$v.form.paths.$model"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="10" class="mt-4">
          <label class="v-label theme--light">Note</label>
          <v-tabs v-model="tabNote" class="mb-1">
            <v-tab key="edit">Edit</v-tab>
            <v-tab key="preview">Preview</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabNote">
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
                v-model="$v.form.note.$model"
              ></v-textarea>
            </v-tab-item>
            <v-tab-item
              key="preview"
              v-html="noteMarked"
              style="min-height: 180px"
              :transition="false"
              :reverse-transition="false"
              class="markdown-body px-3 pt-3"
            >
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
      <v-btn
        color="secondary"
        :disabled="!$v.form.$anyDirty"
        text
        @click="reset"
      >
        Reset
      </v-btn>
      <v-btn
        color="primary"
        :disabled="$v.$invalid"
        text
        @click="$emit('next')"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import _ from "lodash";
import marked from "marked";
import gql from "graphql-tag";

import { required, maxLength, email } from "vuelidate/lib/validators";

import VTextFieldWithDatePicker from "@/components/utils/VTextFieldWithDatePicker.vue";

async function isNameAvailable(name, productTypeId, apolloClient) {
  const QUERY = gql`
    query QueryProductNameInProductAddFormStepStart(
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

  if (data.product) return false;
  return true;
}

function parsableAsDate(value) {
  // test format "YYYY-MM-DD"
  const reg = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}?$/;
  if (!reg.test(value)) return false;
  if (isNaN(new Date(value))) return false;
  return true;
}

const formDefault = () => ({
  name: "",
  dateProduced: new Date().toISOString().substr(0, 10),
  producedBy: "",
  contact: "",
  paths: "",
  note: "",
});

export default {
  name: "ProductAddFormStepStart",
  components: {
    VTextFieldWithDatePicker,
  },
  props: {
    value: Object,
    productType: {
      type: Object,
      required: true,
    },
  },
  data() {
    const formReset = { ...formDefault(), ...(this.value || {}) };
    return {
      formReset,
      form: { ...formReset },
      error: null,
      tabNote: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
        async unique(value) {
          if (value === "") return true;
          try {
            return await isNameAvailable(
              value.trim(),
              this.productType.typeId,
              this.$apollo
            );
          } catch (error) {
            this.error = error;
            return true;
          }
        },
      },
      producedBy: { required },
      dateProduced: { required, parsableAsDate },
      contact: { required },
      paths: {},
      note: {},
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      const field = this.$v.form.name;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.unique &&
        errors.push(`The name "${field.$model.trim()}" is not available.`);
      return errors;
    },
    dateProducedErrors() {
      const errors = [];
      const field = this.$v.form.dateProduced;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.parsableAsDate &&
        errors.push(`"${field.$model}" cannot be parsed as a date.`);
      return errors;
    },
    producedByErrors() {
      const errors = [];
      const field = this.$v.form.producedBy;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
    contactErrors() {
      const errors = [];
      const field = this.$v.form.contact;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      return errors;
    },
    noteMarked() {
      return this.form.note
        ? marked(this.form.note)
        : "<em>Nothing to preview</em>";
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
  },
  methods: {
    debounceInput: _.debounce(function (field, value) {
      // https://github.com/vuelidate/vuelidate/issues/320#issuecomment-395349377
      field.$model = value;
      field.$touch();
    }, 500),
    cancel() {
      this.$emit("cancel");
    },
    reset() {
      this.error = null;
      this.tabNote = null;
      this.form = { ...this.formReset };
      this.$v.$reset();
    },
  },
};
</script>
