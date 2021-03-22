<template>
  <v-form ref="form" v-model="valid">
    <v-container fluid>
      <v-row>
        <v-col order="1" cols="12" md="4">
          <v-text-field
            label="Name*"
            required
            :hint="
              'Name of the ' +
              productType.singular +
              '. This field cannot be changed later.'
            "
            persistent-hint
            v-model="form.name"
            :error-messages="nameErrors"
            @input="$v.form.name.$touch()"
            @blur="$v.form.name.$touch()"
          ></v-text-field>
        </v-col>
        <v-col order="3" cols="6" md="4">
          <v-text-field-with-date-picker
            label="Date produced (YYYY-MM-DD)*"
            :hint="
              'The date on which the ' +
              productType.singular +
              ' was produced, e.g., 2020-05-06. This field cannot be changed later.'
            "
            v-model="form.dateProduced"
            :rules="requiredRules"
          ></v-text-field-with-date-picker>
        </v-col>
        <v-col order="4" cols="6" md="4">
          <v-text-field
            label="Produced by*"
            required
            :hint="
              'The person or group that produced the ' +
              productType.singular +
              ', e.g. pwg-xxx. This field cannot be changed later.'
            "
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
            :hint="
              'A person or group that can be contacted for questions or issues about the ' +
              productType.singular +
              '.'
            "
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
      <v-btn color="secondary" text @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
      <v-btn color="primary" :disabled="!valid" text @click="$emit('next')"
        >Next</v-btn
      >
    </v-card-actions>
  </v-form>
</template>

<script>
import marked from "marked";

import { required, maxLength, email } from "vuelidate/lib/validators";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

import VTextFieldWithDatePicker from "@/components/utils/VTextFieldWithDatePicker";

export default {
  name: "ProductAddFormStepStart",
  components: {
    VTextFieldWithDatePicker,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    form: { required: true },
    productType: { required: true },
  },
  data: () => ({
    tabNote: null,
    valid: true,
    nameRules: [
      (v) => !!v || "This field is required",
    ],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  validations: {
    form: {
      name: { required },
      producedBy: { required },
      contact: { required },
      },
  },
  computed: {
    nameErrors() {
      const errors = [];
      const field = this.$v.form.name;
      if (!field.$dirty) return errors;
      !field.required && errors.push("This field is required");
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
  methods: {
    reset() {
      this.$refs.form.resetValidation();
      this.tabNote = null;
      this.$emit("reset");
    },
  },
};
</script>
