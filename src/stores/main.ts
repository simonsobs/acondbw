import { defineStore } from "pinia";

import QUERY_WEB_CONFIG from "@/graphql/queries/WebConfig.gql";
import MUTATION_SAVE_WEB_CONFIG from "@/graphql/mutations/SaveWebConfig.gql";

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

export const useStore = defineStore("main", {
  state: () => {
    return {
      example: "abc",
      snackbar: false,
      snackbarMessage: null,
      nApolloMutations: 0,
      packageVersion: (process.env.PACKAGE_VERSION as string) || "vx.x.x",
      webConfig: {} as WebConfig,
      webConfigLoaded: false,
    };
  },
  getters: {
    appVersion: (state) => state.packageVersion,
    vuetifyTheme: (state) => {
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
        .filter((e) => e in state.webConfig && state.webConfig[e])
        .reduce((a, e) => ({ ...a, ...{ [e]: state.webConfig[e] } }), {});
    },
  },
  actions: {
    async loadWebConfig(apolloClient) {
      try {
        const { data } = await apolloClient.query({ query: QUERY_WEB_CONFIG });
        this.webConfig = JSON.parse(data.webConfig.json);
        this.webConfigLoaded = true;
      } catch (error) {
        // console.error(error);
      }
    },
    setWebConfig(webConfig: WebConfig) {
      this.webConfig = webConfig;
    },
    async uploadWebConfig(apolloClient) {
      try {
        const { data } = await apolloClient.mutate({
          mutation: MUTATION_SAVE_WEB_CONFIG,
          variables: { json: JSON.stringify(this.webConfig) },
        });
      } catch (e) {
        // console.error(e);
      }
    },
    loadExample() {
      const example = "123";
      this.example = example;
    },
    setSnackbarMessage(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
    },
    closeSnackbar() {
      this.snackbar = false;
    },
    apolloMutationCalled() {
      this.nApolloMutations++;
    },
  },
});