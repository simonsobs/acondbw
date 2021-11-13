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
        v-bind="$attrs"
        v-on="{ ...$listeners, ...on }"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="$attrs.value"
      @input="
        $emit('input', $event);
        menu = false;
      "
      no-title
      scrollable
    ></v-date-picker>
  </v-menu>
</template>

<script>
// https://forum.vuejs.org/t/passing-non-prop-attributes-to-component-sub-elements/16476
// https://github.com/vuejs/vue/releases/tag/v2.4.0
export default {
  name: "VTextFieldWithDatePicker",
  inheritAttrs: false,
  data() {
    return {
      menu: false,
    };
  },
};
</script>
