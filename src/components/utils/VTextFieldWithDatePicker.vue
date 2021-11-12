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
        :label="label"
        :outlined="outlined"
        required
        :hint="hint"
        persistent-hint
        v-bind:value="value"
        v-on:input="$emit('input', $event)"
        :rules="rules"
        :error-messages="errorMessages"
        v-on="on"
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
export default {
  name: "VTextFieldWithDatePicker",
  props: ["value", "outlined", "label", "hint", "rules", "errorMessages"],
  data() {
    return {
      menu: false,
    };
  },
};
</script>
