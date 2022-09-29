import { ref, computed, watch, watchEffect } from "vue";
import { defineStore } from "pinia";
import { Client } from "@urql/vue";

const localStorageKey = "config";

import {
  WebConfigQuery,
  WebConfigDocument,
  SaveWebConfigMutation,
  SaveWebConfigDocument,
  SaveWebConfigMutationVariables,
} from "@/generated/graphql";

export interface VuetifyTheme {
  primary?: string;
  "on-primary"?: string;
  secondary?: string;
  "on-secondary"?: string;
  accent?: string;
  "on-accent"?: string;
  error?: string;
  "on-error"?: string;
  info?: string;
  "on-info"?: string;
  success?: string;
  "on-success"?: string;
  warning?: string;
  "on-warning"?: string;
}

export interface WebConfig extends VuetifyTheme {
  headTitle: string;
  toolbarTitle: string;
  devtoolLoadingstate: boolean;
  productCreationDialog: boolean;
  productUpdateDialog: boolean;
  productDeletionDialog: boolean;
}

function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

function _readFromLocalStorage() {
  const stringified = localStorage.getItem(localStorageKey);
  if (stringified === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(stringified);
  } catch {
    return null;
  }
  if (typeof parsed !== "object") return null;
  return parsed;
}

function readFromLocalStorage() {
  const parsed = _readFromLocalStorage();
  if (parsed === null) localStorage.removeItem(localStorageKey);
  return parsed || {};
}

function writeToLocalStorage(data: unknown) {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

export const useConfigStore = defineStore("config", () => {
  const error = ref<unknown | null>(null);

  const defaultConfig = ref<WebConfig>({
    headTitle: "",
    toolbarTitle: "",
    devtoolLoadingstate: false,
    productCreationDialog: false,
    productUpdateDialog: false,
    productDeletionDialog: false,
  });

  const configLocalStorage = ref({
    ...deepCopy(defaultConfig.value),
    ...readFromLocalStorage(),
  });
  writeToLocalStorage(configLocalStorage.value); // in case defaultConfig has added new properties

  const webConfig = ref(deepCopy(configLocalStorage.value));
  const webConfigJson = computed(() => JSON.stringify(webConfig.value));

  const configServerJson = ref<string | null>(null);
  const configServer = ref<WebConfig | null>(null);
  watch(configServerJson, (newValue) => {
    configServer.value = null;
    if (newValue === null) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(newValue);
    } catch (e) {
      error.value = e;
      return;
    }
    if (parsed === null) {
      error.value = new Error(
        "The config stored on the server is parsed to null"
      );
      return;
    }
    if (typeof parsed !== "object") {
      error.value = new Error(
        `The config stored on the server is not an object: ${parsed}`
      );
      return;
    }
    configServer.value = { ...deepCopy(defaultConfig.value), ...parsed };
    webConfig.value = deepCopy(configServer.value);
    configLocalStorage.value = deepCopy(webConfig.value);
    writeToLocalStorage(configLocalStorage.value);
  });

  const client = ref<Client | null>(null);
  watchEffect(async () => {
    await loadFromServer();
  });

  async function loadFromServer() {
    if (client.value === null) return;
    const { error: combinedError, data } = await client.value
      .query<WebConfigQuery>(WebConfigDocument, {})
      .toPromise();
    if (combinedError) {
      error.value = combinedError;
      return;
    }
    configServerJson.value = data?.webConfig?.json || null;
  }

  const saved = computed(
    () => !(webConfigJson.value === configServerJson.value)
  );

  function reset() {
    if (configServer.value) {
      webConfig.value = deepCopy(configServer.value);
    } else {
      webConfig.value = deepCopy(configLocalStorage.value);
    }
  }

  async function saveToServer() {
    if (client.value === null) return;
    const { error: combinedError, data } = await client.value
      .mutation<SaveWebConfigMutation, SaveWebConfigMutationVariables>(
        SaveWebConfigDocument,
        { json: webConfigJson.value }
      )
      .toPromise();
    if (combinedError) {
      error.value = combinedError;
      return;
    }
    await loadFromServer();
  }

  const vuetifyTheme = computed(() => {
    const theme_fields_base = [
      "primary",
      "secondary",
      "accent",
      "error",
      "info",
      "success",
      "warning",
    ];
    const theme_fields = [
      ...theme_fields_base,
      ...theme_fields_base.map((k) => `on-${k}`),
    ];
    return theme_fields
      .filter((e) => e in webConfig.value && webConfig.value[e])
      .reduce((a, e) => ({ ...a, ...{ [e]: webConfig.value[e] } }), {});
  });


  return {
    error,
    defaultConfig,
    configLocalStorage,
    webConfig,
    webConfigJson,
    configServer,
    configServerJson,
    client,
    saved,
    reset,
    loadFromServer,
    saveToServer,
    vuetifyTheme,
  };
});
