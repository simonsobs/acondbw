<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :value="value"
        v-on:input="$emit('input', $event)"
        v-on="on"
        v-bind="$attrs"
      ></v-text-field>
    </template>
    <v-date-picker
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      no-title
      scrollable
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
// https://forum.vuejs.org/t/passing-non-prop-attributes-to-component-sub-elements/16476
// https://github.com/vuejs/vue/releases/tag/v2.4.0
export default {
  name: "VTextFieldWithDatePicker",
  inheritAttrs: false,
  props: ["value"],
  data() {
    return {
      menu: false,
    };
  },
};
</script>
