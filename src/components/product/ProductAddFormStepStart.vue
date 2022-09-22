<template>
  <div fluid>
    <form-start
      :value="value"
      :productType="productType"
      @valid="valid = $event"
      @input="$emit('input', $event)"
    ></form-start>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="primary" :disabled="!valid" text @click="$emit('next')">
        Next
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import FormStart, { FormStepStart } from "./FormStart.vue";

export { FormStepStart };

export default defineComponent({
  name: "ProductAddFormStepStart",
  components: {
    FormStart,
  },
  props: {
    value: Object as PropType<FormStepStart>,
    productType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
    };
  },
});
</script>
