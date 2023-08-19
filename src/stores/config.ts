import {
  ref,
  computed,
  watch,
  watchEffect,
  toValue,
  getCurrentInstance,
} from "vue";
import { defineStore } from "pinia";

import {
  useWebConfigQuery,
  useSaveWebConfigMutation,
} from "@/generated/graphql";

const localStorageKey = "config";

export interface WebConfig {
  headTitle: string;
  toolbarTitle: string;
  materialDynamicColorSource: string;
  devtoolLoadingstate: boolean;
  productCreationDialog: boolean;
  productUpdateDialog: boolean;
  productDeletionDialog: boolean;
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

function isInSetup() {
  // https://github.com/FormidableLabs/urql/blob/9beb07e6f44c2108dbfa44d4/packages/vue-urql/src/useClient.ts#L27
  return process.env.NODE_ENV === "production" || getCurrentInstance() !== null;
}

export const useConfigStore = defineStore("config", () => {
  const error = ref<unknown | null>(null);

  const inSetup = isInSetup() || undefined;

  const query = ref(inSetup && useWebConfigQuery());
  const mutation = ref(inSetup && useSaveWebConfigMutation());
  // Note: ref() seems necessary inside defineStore(). Without ref(), the
  // automatic unwrapping happens inconsistently. For example, query.fetching is
  // originally a Ref<boolean>. But it will be unref-ed and become a boolean
  // when updated. With ref(), query.value.fetching is always a boolean.

  function refetch() {
    query.value?.executeQuery({ requestPolicy: "network-only" });
  }

  const defaultConfig = ref<WebConfig>({
    headTitle: "",
    toolbarTitle: "",
    materialDynamicColorSource: "#607D8B", // blue grey
    devtoolLoadingstate: false,
    productCreationDialog: false,
    productUpdateDialog: false,
    productDeletionDialog: false,
  });

  const configLocalStorage = ref({
    ...defaultConfig.value,
    ...readFromLocalStorage(),
  });
  writeToLocalStorage(configLocalStorage.value); // in case defaultConfig has added new properties

  const config = ref({ ...configLocalStorage.value });
  const configJson = computed(() => JSON.stringify(config.value, null, 2));

  let configServerJson = ref<string | null | undefined>();

  watchEffect(() => {
    const _error = toValue(query)?.error;
    if (!_error) return;
    error.value = _error;
  });

  watchEffect(() => {
    // set configServerJson from a query response
    if (toValue(query)?.fetching) return;
    const data = toValue(query)?.data;
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
    const _json = toValue(configServerJson);
    if (_json === undefined) return;
    if (_json === null) {
      error.value = new Error("The server returned null for the config.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(_json);
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
    configServer.value = { ...defaultConfig.value, ...parsed };
  });

  watch(
    configServer,
    (val) => {
      if (val === null) return;
      config.value = { ...val };
      configLocalStorage.value = { ...config.value };
      writeToLocalStorage(configLocalStorage.value);
    },
    { deep: true, immediate: true }
  );

  const saved = computed(() => configJson.value === configServerJson.value);

  function reset() {
    if (configServer.value) {
      config.value = { ...configServer.value };
    } else {
      config.value = { ...configLocalStorage.value };
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
  };
});
