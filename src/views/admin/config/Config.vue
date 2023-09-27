<template>
  <div class="pt-5 px-5 pb-16" style="max-width: 960px; margin: auto">
    <div class="text-h4 text-primary">Config</div>
    <div v-if="error" class="pa-5">
      <v-alert type="error" variant="tonal" class="mx-auto" max-width="960px">
        {{ error }}
      </v-alert>
    </div>
    <bar :saved="saved" :error="!!error" @reset="reset" @save="saveToServer">
    </bar>
    <pre>edited: {{ edited }}</pre>
    <v-data-table :headers="headers" :items="items" :items-per-page="-1">
      <template v-slot:item.value="{ item }">
        {{ item.value }}
        <v-icon
          size="x-small"
          icon="mdi-pencil"
          class="mx-1"
          @click="edit(item)"
        ></v-icon>
      </template>
      <template #bottom></template>
    </v-data-table>
    <pre>{{ configJson }}</pre>
    <bar :saved="saved" :error="!!error" @reset="reset" @save="saveToServer">
    </bar>
    <edit-dialog
      v-model="dialog"
      v-model:edited="edited"
      @save="saveEdit"
      @cancel="cancelEdit"
    >
    </edit-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/plugins/pinia/stores/config";

import Bar from "./Bar.vue";
import EditDialog from "./EditDialog.vue";

// https://stackoverflow.com/a/66430948/7309855
let a_: any;
const t_ = typeof a_;
type TypeOfTypes = typeof t_;

interface Item {
  key: string;
  value: string;
  type: TypeOfTypes;
}

interface StringKeyObject {
  [key: string]: unknown;
}

const configStore = useConfigStore();

const { config, configJson, saved, error } = storeToRefs(configStore);
const { saveToServer, reset } = configStore;

const items = ref<Item[]>([]);
watchEffect(() => {
  items.value = reshapeWebConfigToItems(config.value);
});

function reshapeWebConfigToItems(webConfig: StringKeyObject) {
  return Object.entries(webConfig).map((e) => ({
    key: e[0],
    value: JSON.stringify(e[1]),
    type: typeof e[1],
  }));
}

const headers = ref([
  { title: "Key", key: "key" },
  { title: "Value (stringified)", key: "value" },
  { title: "Type", key: "type" },
]);

const dialog = ref(false);
const editedItem = ref<Item | null>(null);
const edited = ref("");
function edit(item: Item) {
  editedItem.value = item;
  edited.value = item.value;
  dialog.value = true;
}
function saveEdit() {
  if (editedItem.value === null) return;
  config.value[editedItem.value.key] = JSON.parse(edited.value);
  edited.value = "";
  dialog.value = false;
}
function cancelEdit() {
  editedItem.value = null;
  edited.value = "";
  dialog.value = false;
}
</script>
