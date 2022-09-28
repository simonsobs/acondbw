import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("main", () => {
  const example = ref("abc");
  const snackbar = ref(false);
  const snackbarMessage = ref<string | null>(null);
  const nApolloMutations = ref(0);
  const packageVersion = ref(import.meta.env.PACKAGE_VERSION || "vx.x.x");
  const appVersion = computed(() => packageVersion.value);
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
    appVersion,
    loadExample,
    setSnackbarMessage,
    closeSnackbar,
    apolloMutationCalled,
  };
});
