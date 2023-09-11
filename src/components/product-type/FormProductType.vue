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
            v-model="v$.plural.$model"
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
                  v-model="v$.indefArticle.$model"
                  :hint="indefArticleHint"
                  persistent-hint
                  row
                >
                  <v-radio
                    v-for="item in indefArticleItems"
                    :label="item.text"
                    :value="item.value"
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
                  :prefix="v$.indefArticle.$model || undefined"
                  v-model="v$.singular.$model"
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
            v-model="v$.name.$model"
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
            v-model="v$.icon.$model"
            :prepend-icon="v$.icon.$model || undefined"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item?.raw"
                :title="item?.raw"
              ></v-list-item>
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
            v-model="v$.order.$model"
            :error-messages="orderErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          :disabled="!v$.$anyDirty"
          variant="text"
          @click="reset"
        >
          Reset
        </v-btn>
      </v-card-actions>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, integer } from "@vuelidate/validators";

import { mdIcons } from "@/utils/md-icons";

import { CreateProductTypeInput } from "@/graphql/codegen/generated";

const iconItems = mdIcons.map(({ name }) => `mdi-${name}`);

type ValueType = Omit<CreateProductTypeInput, "fieldIds">;

interface Props {
  modelValue: ValueType;
}

interface Emits {
  (event: "update:modelValue", value: ValueType): void;
  (event: "valid", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formDefault = {
  name: "",
  order: null,
  indefArticle: "",
  singular: "",
  plural: "",
  icon: "mdi-chart-gantt",
};
const formReset = { ...formDefault, ...(props.modelValue || {}) };
const form = reactive({ ...formReset });

const pluralHint =
  'Product type name in the plural form, e.g., "maps". ' +
  "If the plural form does not exist, use the singular form. " +
  "White spaces can be included. " +
  "Use all lowercase unless the word is usually written in uppercase. " +
  "It will be capitalized automatically when rendered if appropriate. ";

const indefArticleHint =
  "The indefinite article to be placed before the singular form of the product type name.";

const indefArticleItems = [
  { text: "a", value: "a" },
  { text: "an", value: "an" },
  { text: "(none)", value: "" },
];

const singularHint =
  'Product type name in the singular form, e.g., "map". ' +
  "White spaces can be included. " +
  "Use all lowercase unless the word is usually written in uppercase. " +
  "It will be capitalized automatically when rendered if appropriate. ";

const nameHint =
  "Name of the product type in the " +
  '<a href="https://en.wikipedia.org/wiki/Snake_case" target="_blank">snake case</a> ' +
  "Use the singular name with all white spaces replaced with underscores if possible. ";

const iconHint =
  "Icon for the product type. " +
  "Choose from material design icons: " +
  '<a href="https://pictogrammers.github.io/@mdi/font/6.3.95/" target="_blank">materialdesignicons.com/</a>';

const orderHint =
  "The product types are laid out in the ascending order of these values " +
  "when relevant, e.g., in the sidebar navigation.";

const rules = {
  name: { required },
  order: { integer },
  indefArticle: {},
  singular: { required },
  plural: { required },
  icon: {},
};

const v$ = useVuelidate(rules, form);

const nameErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.name;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

const singularErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.singular;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

const pluralErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.plural;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

const orderErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.order;
  if (!field.$dirty) return errors;
  field.integer.$invalid && errors.push("Must be an integer value");
  return errors;
});

const valid = computed(() => !v$.value.$invalid);

watch(
  () => props.modelValue,
  () => {
    if (JSON.stringify(props.modelValue) === JSON.stringify(form)) return;
    Object.assign(form, { ...formReset, ...(props.modelValue || {}) });
  },
  { deep: true }
);

watch(
  () => form,
  () => {
    // if (v$.value.$invalid) return;
    emit("update:modelValue", { ...form });
  },
  { deep: true, immediate: true }
);

watch(
  () => valid.value,
  (val) => {
    emit("valid", val);
  },
  { immediate: true }
);

function reset() {
  Object.assign(form, { ...formReset });
  v$.value.$reset();
}
</script>

<style>
legend#radio-group-indef-article {
  width: 100%;
  margin-bottom: 4px;
}
</style>
