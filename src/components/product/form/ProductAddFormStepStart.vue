<template>
  <div fluid>
    <form-start
      :model-value="modelValue"
      :productType="productType"
      @valid="valid = $event"
      @update:model-value="emit('update:modelValue', $event)"
    ></form-start>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" @click="emit('cancel')">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!valid"
        variant="text"
        @click="emit('next')"
      >
        Next
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormStart from "./FormStart.vue";

export type FormStepStart = NonNullable<
  InstanceType<typeof FormStart>["modelValue"]
>;

interface Props {
  modelValue: FormStepStart | null;
  productType: any;
}

interface Emits {
  (event: "update:modelValue", value: FormStepStart): boolean;
  (event: "cancel"): boolean;
  (event: "next"): boolean;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const valid = ref(false);
</script>
