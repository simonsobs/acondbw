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
        required
        :hint="hint"
        persistent-hint
        v-bind:value="value"
        v-on:input="$emit('input', $event)"
        :rules="rules"
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
  name: "FormDateProduced",
  props: ["value", "label", "hint", "rules"],
  data() {
    return {
      menu: false
    };
  }
};
</script>
