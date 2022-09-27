<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Config</v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="items.length"
            :hide-default-footer="true"
          >
            <!-- <template v-slot:[slotName]="{ item }">
                {{ item }}
            </template> -->
            <template v-slot:[`item.key`]="{ item }">
              <v-edit-dialog
                :return-value.sync="item.key"
                large
                @save="save(item)"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                {{ item.key }}
                <template v-slot:input>
                  <v-text-field
                    v-model="item.key"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:[`item.value`]="{ item }">
              <v-edit-dialog
                :return-value.sync="item.value"
                large
                @save="save(item)"
                @cancel="cancel"
                @open="open"
                @close="close"
              >
                {{ item.value }}
                <template v-slot:input>
                  <v-text-field
                    v-model="item.value"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text :disabled="!changed" @click="reset()">
              Reset
            </v-btn>
            <v-btn
              color="primary"
              text
              :disabled="!changed || !!error"
              @click="saveToServer()"
            >
              Save to server
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "Config" });
</script>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useClientHandle } from "@urql/vue";
import { useStore } from "@/stores/main";
import { useConfig } from "@/utils/config";

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

const store = useStore();
const urqlClientHandle = useClientHandle();
const config = useConfig();

const error = ref<any>(null);

const webConfig = computed(() => config.config.value);
const itemsInStore = computed(() => reshapeWebConfigToItems(webConfig.value));

function reshapeWebConfigToItems(webConfig: StringKeyObject) {
  return Object.entries(webConfig).map((e) => ({
    key: e[0],
    value: JSON.stringify(e[1]),
    type: typeof e[1],
  }));
}

function reshapeItemsToWebConfig(items: Item[]) {
  const webConfig = items.reduce(
    (a, item) => ({
      ...a,
      ...{ [item.key]: JSON.parse(item.value) },
    }),
    {} as StringKeyObject
  );
  return webConfig;
}

const webConfigOriginal = ref<typeof webConfig.value>({});
const itemsOriginal = ref<Item[]>([]);
const items = ref<Item[]>([]);

const changed = computed(
  () => !(JSON.stringify(items.value) === JSON.stringify(itemsOriginal.value))
);

function copyOriginal() {
  webConfigOriginal.value = nestedCopy(webConfig.value);
  itemsOriginal.value = reshapeWebConfigToItems(webConfigOriginal.value);
  items.value = nestedCopy(itemsOriginal.value);
}

function nestedCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

const first = ref(true);
watch(
  config.loaded,
  (newValue) => {
    if (!newValue) return;
    if (!first.value) return;
    copyOriginal();
    first.value = false;
  },
  { immediate: true }
);

function reset() {
  items.value = nestedCopy(itemsOriginal.value);
  store.setWebConfig(webConfigOriginal.value);
  error.value = null;
}

function saveToServer() {
  store.uploadWebConfig(urqlClientHandle.client);
  copyOriginal();
}

function save(item: Item) {
  error.value = null;

  try {
    item.type = typeof JSON.parse(item.value);
  } catch (e) {
    error.value = e;
    return;
  }

  let webConfig: StringKeyObject;
  try {
    webConfig = reshapeItemsToWebConfig(items.value);
  } catch (e) {
    error.value = e;
    return;
  }

  store.setWebConfig(webConfig);
}

function cancel() {}
function open() {}
function close() {}

const headers = ref([
  { text: "Key", value: "key" },
  { text: "Value (stringified)", value: "value" },
  { text: "Type", value: "type" },
]);
</script>
