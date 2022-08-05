import { defineStore } from "pinia";

import QUERY_WEB_CONFIG from "@/graphql/queries/WebConfig.gql";
import MUTATION_SAVE_WEB_CONFIG from "@/graphql/mutations/SaveWebConfig.gql";

const WEB_CONFIG_FIELDS = [
  "headTitle",
  "toolbarTitle",
  "devtoolLoadingstate",
  "productCreationDialog",
  "productUpdateDialog",
  "productDeletionDialog",
  "primary",
  "on-primary",
  "secondary",
  "on-secondary",
  "accent",
  "on-accent",
  "error",
  "on-error",
  "info",
  "on-info",
  "success",
  "on-success",
  "warning",
  "on-warning",
];

export const useStore = defineStore("main", {
  state: () => {
    return {
      example: "abc",
      snackbar: false,
      snackbarMessage: null,
      nApolloMutations: 0,
      packageVersion: process.env.PACKAGE_VERSION || "0",
      webConfig: {},
      webConfigLoaded: false,
    };
  },
  getters: {
    appVersion: (state) => state.packageVersion,
  },
  actions: {
    async loadWebConfig(apolloClient) {
      try {
        const { data } = await apolloClient.query({ query: QUERY_WEB_CONFIG });
        const base = Object.fromEntries(
          WEB_CONFIG_FIELDS.map((e) => [e, null])
        );
        const saved = JSON.parse(data.webConfig.json);
        const webConfig = { ...base, ...saved };
        this.webConfig = webConfig;
        this.webConfigLoaded = true;
      } catch (error) {
        // console.error(error);
      }
    },
    setWebConfig(webConfig) {
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
