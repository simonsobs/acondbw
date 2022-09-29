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
            <template v-slot:item.key="{ item }">
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
            <template v-slot:item.value="{ item }">
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
            <v-btn color="secondary" text :disabled="!saved" @click="reset()">
              Reset
            </v-btn>
            <v-btn
              color="primary"
              text
              :disabled="!saved || !!error"
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
import { storeToRefs } from "pinia";
export default defineComponent({ name: "Config" });
</script>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useConfigStore } from "@/stores/config";

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

const { webConfig, saved, error } = storeToRefs(configStore);
const { saveToServer, reset } = configStore;

const items = ref<Item[]>([]);
watchEffect(() => {
  items.value = reshapeWebConfigToItems(webConfig.value);
});

function reshapeWebConfigToItems(webConfig: StringKeyObject) {
  return Object.entries(webConfig).map((e) => ({
    key: e[0],
    value: JSON.stringify(e[1]),
    type: typeof e[1],
  }));
}

function save(item: Item) {
  webConfig.value[item.key] = JSON.parse(item.value);
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
