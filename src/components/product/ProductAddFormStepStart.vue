<template>
  <v-form ref="form">
    <v-container fluid>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-row>
        <v-col order="1" cols="12" md="4">
          <v-text-field
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
        <v-col order="3" cols="6" md="4">
          <v-text-field-with-date-picker
            outlined
            label="Date produced (YYYY-MM-DD)*"
            :hint="`The date on which the ${productType.singular} was produced, e.g., 2020-05-06. This field cannot be changed later.`"
            required
            persistent-hint
            v-model="form.dateProduced"
            :error-messages="dateProducedErrors"
            @input="$v.form.dateProduced.$touch()"
            @blur="$v.form.dateProduced.$touch()"
          ></v-text-field-with-date-picker>
        </v-col>
        <v-col order="4" cols="6" md="4">
          <v-text-field
            label="Produced by*"
            required
            :hint="`The person or group that produced the ${productType.singular}, e.g. pwg-xxx. This field cannot be changed later.`"
            persistent-hint
            v-model="form.producedBy"
            :error-messages="producedByErrors"
            @input="$v.form.producedBy.$touch()"
            @blur="$v.form.producedBy.$touch()"
          ></v-text-field>
        </v-col>
        <v-col order="4" cols="6" offset-md="4" md="4">
          <v-text-field
            label="Contact*"
            required
            :hint="`A person or group that can be contacted for questions or issues about the ${productType.singular}.`"
            persistent-hint
            v-model="form.contact"
            :error-messages="contactErrors"
            @input="$v.form.contact.$touch()"
            @blur="$v.form.contact.$touch()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" offset-md="4">
          <v-textarea
            label="Paths"
            hint="A path per line. e.g., nersc:/go/to/my/product_v3"
            rows="2"
            persistent-hint
            v-model="form.paths"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" offset-md="4" class="mt-4">
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
                v-model="form.note"
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
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
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

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

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

  if (data.product) {
    // the name isn't available
    return false;
  }

  return true;
}

function parsableAsDate(value) {
  // test format "YYYY-MM-DD"
  const reg = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}?$/;
  if (!reg.test(value)) {
    return false;
  }

  return !isNaN(new Date(value));
}

export default {
  name: "ProductAddFormStepStart",
  components: {
    VTextFieldWithDatePicker,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    formResetCount: Number,
    form: {
      type: Object,
      required: true,
    },
    productType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      const field = this.$v.form.name;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.unique &&
        errors.push(
          `The name "${this.$v.form.name.$model.trim()}" is not available.`
        );
      return errors;
    },
    dateProducedErrors() {
      const errors = [];
      const field = this.$v.form.dateProduced;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
      !field.parsableAsDate &&
        errors.push(
          `"${this.$v.form.dateProduced.$model}" cannot be parsed as a date.`
        );
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
    formResetCount() {
      this.$v.$reset();
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
      setTimeout(() => {
        this.error = null;
        this.$v.$reset();
        this.tabNote = null;
      }, 500); // reset 0.5 sec after so that the reset form won't be shown.
    },
    reset() {
      this.error = null;
      this.$v.$reset();
      this.tabNote = null;
      this.$emit("reset");
    },
  },
};
</script>
