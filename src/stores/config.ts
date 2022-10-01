import { ref, computed, watch, watchEffect } from "vue";
import { defineStore } from "pinia";

import {
  useWebConfigQuery,
  useSaveWebConfigMutation,
} from "@/generated/graphql";

const localStorageKey = "config";

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

  const query = ref(useWebConfigQuery());
  const mutation = ref(useSaveWebConfigMutation());
  // Note: ref() seems necessary inside defineStore(). Without ref(), the
  // automatic unwrapping happens inconsistently. For example, query.fetching is
  // originally a Ref<boolean>. But it will be unref-ed and become a boolean
  // when updated. With ref(), query.value.fetching is always a boolean.

  function refetch() {
    query.value.executeQuery({ requestPolicy: "network-only" });
  }

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

  const config = ref(deepCopy(configLocalStorage.value));
  const configJson = computed(() => JSON.stringify(config.value));

  let configServerJson = ref<string | null | undefined>();

  watchEffect(() => {
    if (!query.value?.error) return;
    error.value = query.value.error;
  });

  watchEffect(() => {
    // set configServerJson from a query response
    if (query.value?.fetching) return;
    const data = query.value?.data;
    if (!data) return;
    const json = data.webConfig?.json;
    if (json === undefined || json === null) {
      const stringified = JSON.stringify(data);
      error.value = new Error(
        `The server returned undefined or null for webConfig.json: data = ${stringified}`
      );
      return;
    }
    configServerJson.value = json;
  });

  const configServer = ref<WebConfig | null>(null);

  watchEffect(() => {
    // set configServer from configServerJson
    configServer.value = null;
    if (configServerJson.value === undefined) return;
    if (configServerJson.value === null) {
      error.value = new Error("The server returned null for the config.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(configServerJson.value);
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
  });

  watch(
    configServer,
    (val) => {
      if (val === null) return;
      config.value = deepCopy(val);
      configLocalStorage.value = deepCopy(config.value);
      writeToLocalStorage(configLocalStorage.value);
    },
    { deep: true, immediate: true }
  );

  const saved = computed(() => configJson.value === configServerJson.value);

  function reset() {
    if (configServer.value) {
      config.value = deepCopy(configServer.value);
    } else {
      config.value = deepCopy(configLocalStorage.value);
    }
  }

  async function saveToServer() {
    if (!mutation.value) return;
    const { error: combinedError } = await mutation.value.executeMutation({
      json: configJson.value,
    });
    if (combinedError) {
      error.value = combinedError;
      return;
    }
    refetch();
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
      .filter((e) => e in config.value && config.value[e])
      .reduce((a, e) => ({ ...a, ...{ [e]: config.value[e] } }), {});
  });

  return {
    error,
    defaultConfig,
    configLocalStorage,
    config,
    configJson,
    configServer,
    configServerJson,
    saved,
    reset,
    loadFromServer: refetch,
    saveToServer,
    vuetifyTheme,
  };
});
