<template>
  <div>
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
            :model-value="v$.form.name.$model"
            @input="debounceInput(v$.form.name, $event)"
            @blur="v$.form.name.$touch()"
          ></v-text-field>
        </v-col>
        <v-col order="3" cols="12" md="10">
          <!-- need more work on v-date-picker -->
          <!-- <v-text-field-with-date-picker
            outlined
            label="Date produced (YYYY-MM-DD)*"
            required
            :hint="`The date on which the ${productType.singular} was produced, e.g., 2020-05-06.`"
            persistent-hint
            v-model="v$.form.dateProduced.$model"
            :error-messages="dateProducedErrors"
          >
          </v-text-field-with-date-picker> -->
          <v-text-field
            outlined
            label="Date produced (YYYY-MM-DD)*"
            required
            :hint="`The date on which the ${productType.singular} was produced, e.g., 2020-05-06.`"
            persistent-hint
            v-model="v$.form.dateProduced.$model"
            :error-messages="dateProducedErrors"
          >
          </v-text-field>
        </v-col>
        <v-col order="4" cols="12" md="10">
          <v-text-field
            outlined
            label="Produced by*"
            required
            :hint="`The person or group that produced the ${productType.singular}, e.g. pwg-xxx.`"
            persistent-hint
            v-model="v$.form.producedBy.$model"
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
            v-model="v$.form.contact.$model"
            :error-messages="contactErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-textarea
            outlined
            label="Paths"
            hint="A path per line. e.g., nersc:/go/to/my/product_v3. Note that paths are an unordered set; they will not be always displayed in the order entered here."
            rows="4"
            persistent-hint
            v-model="v$.form.paths.$model"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="10" class="mt-4">
          <label class="v-label">Note</label>
          <v-tabs v-model="tabNote" class="mb-1">
            <v-tab value="edit">Edit</v-tab>
            <v-tab value="preview">Preview</v-tab>
          </v-tabs>
          <v-window v-model="tabNote">
            <v-window-item
              value="edit"
              style="min-height: 180px"
              :transition="false"
              :reverse-transition="false"
            >
              <v-textarea
                solo
                outlined
                label="Note will be parsed as Markdown"
                rows="5"
                v-model="v$.form.note.$model"
              ></v-textarea>
            </v-window-item>
            <v-window-item
              value="preview"
              v-html="noteMarked"
              style="min-height: 180px; width: 98%; border: solid 1px"
              :transition="false"
              :reverse-transition="false"
              class="markdown-body px-3 py-3"
            >
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        :disabled="!v$.form.$anyDirty"
        variant="text"
        @click="reset"
      >
        Reset
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import _ from "lodash";
import { marked } from "marked";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import { useIsNameAvailable } from "./name-availability";

import VTextFieldWithDatePicker from "@/components/utils/VTextFieldWithDatePicker.vue";
import { watchEffect } from "vue";

const { withAsync } = helpers;

const { isNameAvailable } = useIsNameAvailable();

function parsableAsDate(value: string) {
  // test format "YYYY-MM-DD"
  const reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}?$/;
  if (!reg.test(value)) return false;
  if (isNaN(new Date(value).valueOf())) return false;
  return true;
}

interface FormStepStart {
  name: string;
  dateProduced: string;
  producedBy: string;
  contact: string;
  paths: string;
  note: string;
}

interface Props {
  modelValue: FormStepStart | null;
  valid?: boolean;
  productType: {
    typeId: number;
    name: string;
    singular: string;
    plural: string;
  };
}

type Emits = {
  "update:modelValue": [value: FormStepStart];
  "update:valid": [value: boolean];
  cancel: [];
};

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const error = ref<any>(null);

const formDefault: FormStepStart = {
  name: "",
  dateProduced: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
  producedBy: "",
  contact: "",
  paths: "",
  note: "",
};

const formReset = ref<FormStepStart>({
  ...formDefault,
  ...(prop.modelValue || {}),
});

const form = ref<FormStepStart>({ ...formReset.value });

const rules = computed(() => ({
  form: {
    name: {
      required,
      unique: withAsync(async (value: string) => {
        if (value === "") return true;
        if (value === formReset.value.name) return true;
        return await isNameAvailable(value.trim(), prop.productType.typeId);
      }),
    },
    producedBy: { required },
    dateProduced: { required, parsableAsDate },
    contact: { required },
    paths: {},
    note: {},
  },
}));

const v$ = useVuelidate(rules, { form });

const nameErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.form.name;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  field.unique.$invalid &&
    // @ts-ignore
    errors.push(`The name "${field.$model.trim()}" is not available.`);
  return errors;
});

const dateProducedErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.form.dateProduced;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  field.parsableAsDate.$invalid &&
    errors.push(`"${field.$model}" cannot be parsed as a date.`);
  return errors;
});

const producedByErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.form.producedBy;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

const contactErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.form.contact;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

watchEffect(() => {
  emit("update:valid", !v$.value.$invalid);
});

watch(
  () => prop.modelValue,
  (val) => {
    if (JSON.stringify(val) === JSON.stringify(form.value)) return;
    form.value = { ...formReset.value, ...(val || {}) };
  },
  { deep: true }
);

watchEffect(() => {
  emit("update:modelValue", { ...form.value });
});

const tabNote = ref<"edit"| "preview">("edit");

const noteMarked = computed(() =>
  form.value.note
    ? marked.parse(form.value.note)
    : "<em>Nothing to preview</em>"
);

const debounceInput = _.debounce(function (field, event) {
  // https://github.com/vuelidate/vuelidate/issues/320#issuecomment-395349377
  field.$model = event.target.value;
  field.$touch();
}, 500);

function cancel() {
  emit("cancel");
}

function reset() {
  error.value = null;
  tabNote.value = "edit";
  form.value = { ...formReset.value };
  v$.value.$reset();
}
</script>
