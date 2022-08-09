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
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useStore } from "@/stores/main";

export default Vue.extend({
  name: "Config",
  data() {
    return {
      first: true,
      webConfigOriginal: {},
      itemsOriginal: [],
      items: [],
      headers: [
        { text: "Key", value: "key" },
        { text: "Value (stringified)", value: "value" },
        { text: "Type", value: "type" },
      ],
      error: null,
    };
  },
  computed: {
    itemsInStore() {
      return this.reshapeWebConfigToItems(this.webConfig);
    },
    changed() {
      return !(
        JSON.stringify(this.items) === JSON.stringify(this.itemsOriginal)
      );
    },
    slotName() {
      return "item.key";
    },
    ...mapState(useStore, ["webConfig", "webConfigLoaded"]),
  },
  watch: {
    webConfigLoaded: {
      immediate: true,
      handler(newValue) {
        if (!newValue) return;
        if (!this.first) return;
        this.copyOriginal();
        // this.webConfigOriginal = this.nestedCopy(this.webConfig);
        // this.itemsOriginal = this.reshapeWebConfigToItems(
        //   this.webConfigOriginal
        // );
        // this.items = this.nestedCopy(this.itemsOriginal);
        this.first = false;
      },
    },
  },
  methods: {
    copyOriginal() {
      this.webConfigOriginal = this.nestedCopy(this.webConfig);
      this.itemsOriginal = this.reshapeWebConfigToItems(this.webConfigOriginal);
      this.items = this.nestedCopy(this.itemsOriginal);
    },
    nestedCopy(data) {
      return JSON.parse(JSON.stringify(data));
    },
    reshapeWebConfigToItems(webConfig) {
      return Object.entries(webConfig).map((e) => ({
        key: e[0],
        value: JSON.stringify(e[1]),
        type: typeof e[1],
      }));
    },
    reshapeItemsToWebConfig(items) {
      const webConfig = items.reduce(
        (a, item) => ({
          ...a,
          ...{ [item.key]: JSON.parse(item.value) },
        }),
        {}
      );
      return webConfig;
    },
    reset() {
      this.items = this.nestedCopy(this.itemsOriginal);
      this.setWebConfig(this.webConfigOriginal);
      this.error = null;
    },
    saveToServer() {
      this.uploadWebConfig(this.$apollo);
      this.copyOriginal();
    },
    save(item) {
      this.error = null;

      try {
        item.type = typeof JSON.parse(item.value);
      } catch (e) {
        item.type = `error: cannot parse "${item.value}"`;
        this.error = e;
      }

      if (this.error) return;

      let webConfig;
      try {
        webConfig = this.reshapeItemsToWebConfig(this.items);
      } catch (e) {
        this.error = e;
      }

      if (this.error) return;

      this.setWebConfig(webConfig);
    },
    cancel() {},
    open() {},
    close() {},
    ...mapActions(useStore, ["setWebConfig", "uploadWebConfig"]),
  },
});
</script>
