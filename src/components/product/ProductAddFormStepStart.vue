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

<script>
import FormStart from "./FormStart.vue";

export default {
  name: "ProductAddFormStepStart",
  components: {
    FormStart,
  },
  props: {
    value: Object,
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
};
</script>
