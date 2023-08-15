<template>
  <v-tabs v-model="tabNote" class="mb-1">
    <v-tab value="edit">Edit</v-tab>
    <v-tab value="preview">Preview</v-tab>
  </v-tabs>
  <v-window v-model="tabNote">
    <v-window-item
      value="edit"
      style="min-height: 180px"
      :transition="false"
      :reverse-transition="false"
    >
      <v-textarea
        solo
        outlined
        label="Note will be parsed as Markdown"
        rows="5"
        :model-value="note"
        @update:model-value="onUpdate"
      ></v-textarea>
    </v-window-item>
    <v-window-item
      value="preview"
      v-html="noteMarked"
      style="min-height: 180px; width: 98%; border: solid 1px"
      :transition="false"
      :reverse-transition="false"
      class="markdown-body px-3 py-3"
    >
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { marked } from "marked";

interface Props {
  modelValue: string;
}

type Emits = {
  "update:modelValue": [value: string];
};

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const note = ref(prop.modelValue);
watchEffect(() => {
  note.value = prop.modelValue;
});

function onUpdate(value: string) {
  note.value = value;
  emit("update:modelValue", value);
}

const noteMarked = computed(() =>
  note.value ? marked.parse(note.value) : "<em>Nothing to preview</em>"
);

const tabNote = ref<"edit" | "preview">("edit");
</script>
