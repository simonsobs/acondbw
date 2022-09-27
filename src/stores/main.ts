import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { Client } from "@urql/vue";

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
  headTitle?: string;
  toolbarTitle?: string;
  devtoolLoadingstate?: boolean;
  productCreationDialog?: boolean;
  productUpdateDialog?: boolean;
  productDeletionDialog?: boolean;
}

export const useStore = defineStore("main", () => {
  const example = ref("abc");
  const snackbar = ref(false);
  const snackbarMessage = ref<string | null>(null);
  const nApolloMutations = ref(0);
  const packageVersion = ref(import.meta.env.PACKAGE_VERSION || "vx.x.x");
  const webConfig = ref<WebConfig>({});
  const webConfigLoaded = ref(false);
  const appVersion = computed(() => packageVersion.value);
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
  async function loadWebConfig(urqlClient: Client) {
    try {
      const { error, data } = await urqlClient
        .query<WebConfigQuery>(WebConfigDocument, {})
        .toPromise();
      if (error) throw error;
      webConfig.value = JSON.parse(data.webConfig.json);
      webConfigLoaded.value = true;
    } catch (error) {
      // console.error(error);
    }
  }
  function setWebConfig(val: WebConfig) {
    webConfig.value = val;
  }
  async function uploadWebConfig(urqlClient: Client) {
    try {
      const { error, data } = await urqlClient
        .mutation<SaveWebConfigMutation, SaveWebConfigMutationVariables>(
          SaveWebConfigDocument,
          {
            json: JSON.stringify(webConfig.value),
          }
        )
        .toPromise();
      if (error) throw error;
    } catch (e) {
      // console.error(e);
    }
  }
  function loadExample() {
    example.value = "123";
  }
  function setSnackbarMessage(message: string) {
    snackbarMessage.value = message;
    snackbar.value = true;
  }
  function closeSnackbar() {
    snackbar.value = false;
  }
  function apolloMutationCalled() {
    nApolloMutations.value++;
  }
  return {
    example,
    snackbar,
    snackbarMessage,
    nApolloMutations,
    packageVersion,
    webConfig,
    webConfigLoaded,
    appVersion,
    vuetifyTheme,
    loadWebConfig,
    setWebConfig,
    uploadWebConfig,
    loadExample,
    setSnackbarMessage,
    closeSnackbar,
    apolloMutationCalled,
  };
});
