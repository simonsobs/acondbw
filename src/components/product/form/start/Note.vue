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
      class="px-3 py-3"
    >
      <v-textarea
        variant="outlined"
        hint="Note will be parsed as Markdown. Math expressions are rendered with MathJax ($ and $$ are delimiters for inline and display math, respectively)."
        persistent-hint
        rows="6"
        :model-value="note"
        @update:model-value="onUpdate"
      ></v-textarea>
    </v-window-item>
    <v-window-item
      value="preview"
      style="min-height: 180px; width: 98%; border: solid 1px"
      :transition="false"
      :reverse-transition="false"
    >
      <note :markdown="note"></note>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { marked } from "marked";

import Note from "@/components/product/item-card/note/Note.vue";

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
