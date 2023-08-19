<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="500"
    :close-on-content-click="false"
  >
    <v-card>
      <v-card-text>
        <v-text-field
          :model-value="edited"
          @update:model-value="emit('update:edited', $event)"
          label="Edit"
          single-line
          counter
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn variant="text" @click="save">Save</v-btn>
      </v-card-actions>
      <pre>edited: {{ edited }}</pre>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  edited: string;
}

type Emits = {
  "update:modelValue": [value: boolean];
  "update:edited": [value: string];
  save: [];
  cancel: [];
};

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

function save() {
  emit("save");
}
function cancel() {
  emit("cancel");
}
</script>
