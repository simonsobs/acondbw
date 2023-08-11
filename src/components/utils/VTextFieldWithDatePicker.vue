<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    persistent
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="textFieldValue"
        v-bind="{ ...$attrs, ...props }"
        @update:focused="focused($event)"
      ></v-text-field>
    </template>
    <v-date-picker v-model="pickerValue" hide-actions>
      <template v-slot:header></template>
    </v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
// Discored thread about v-text-field with v-date-picker
// https://discord.com/channels/340160225338195969/954061264865349652/1136734637113233540

// A link to an example from the above thread
// https://play.vuetifyjs.com/#eNqlUstOwzAQ/JWVOQBSEwvBqSoIJPgKwiFNtsIQP2RvAqjKv7N2SnFaDpW4ZWdnZ3bHed6KB+fKoUexFCtC7bqa8K4yAKuhqJ1Ln6lorKFaGfQ7KIEaTb+vGflRgLO6ITXUZP1tJbbgvHUBxkpk5CRA+EnFRmHX5g2Arl5jx6NPhtDDI0tWYs5gc9smjv76u79WpuV28p5371Yyt84vkLMQ9nu2jBRONe+8zbFz0ssovxExnmUUy3mOEZlinjlzGRqvHEFA6qdXUNpZT7AFjxsYYeOthnN+ufNIB2DdQDBtBLeRdGH6rruMypMWq4iFmGQKXbvyLVjD776N49WuwUktISERY/lYV+KVyIWllE1reIyvV4MvDZI0Tst7pknfG1Iai9bq++vyuryRrQqUwyUGXay9/QjoWaQSi8yG1ObrBKsdMzlcXU0WO6zgfyZEjyNtyYYD+sKjadGjP/Wkg7H8rIPW0WnRfazMyIF3yryHg6ybkHJ+/lnyfzcntSj1Eh3HhUiLsvU0IV6+AbPwQf0=

import { computed, ref, watchEffect } from "vue";

// Fallthrought attributes: https://vuejs.org/guide/components/attrs.html
defineOptions({
  inheritAttrs: false,
});

interface Props {
  modelValue: string;
}

interface Emits {
  (event: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modelValue = computed(() => props.modelValue);
const textFieldValue = ref(modelValue.value);
const validValue = ref("");
const pickerValue = ref<any>(modelValue.value);

watchEffect(() => {
  textFieldValue.value = modelValue.value;
});

watchEffect(() => {
  if (parseAsDate(textFieldValue.value)) {
    validValue.value = textFieldValue.value;
  }
});

watchEffect(() => {
  if (validValue.value) {
    emit("update:modelValue", format(validValue.value));
  }
});

const menu = ref(false);

watchEffect(() => {
  pickerValue.value = validValue.value;
});

watchEffect(() => {
  textFieldValue.value = format(pickerValue.value);
});

function format(value: string | number | Date) {
  // to YYYY-MM-DD (https://stackoverflow.com/a/38148759/7309855)
  return new Date(value).toISOString().slice(0, 10);
}

/**
 * @param value - A string to parse as a date
 * @returns - A Date object or null
 */
function parseAsDate(value: string) {
  // test format "YYYY-MM-DD"
  const reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}?$/;
  if (!reg.test(value)) return null;
  const date = new Date(value);
  if (isNaN(date.valueOf())) return null;
  return date;
}

function focused(value: boolean) {
  if (value) return;
  textFieldValue.value = validValue.value;
}
</script>
