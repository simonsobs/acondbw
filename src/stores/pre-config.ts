import { ref } from "vue";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";
import * as path from "path";

interface PreConfig {
  graphqlHttp?: string;
}

export const usePreConfigStore = defineStore("preConfig", () => {
  const url = ref(path.join(import.meta.env.VITE_PUBLIC_PATH, "config.json"));

  const {
    data: preConfig,
    error,
    isLoading: loading,
  } = useAxios<PreConfig>(url.value);

  return {
    url,
    loading,
    error,
    preConfig,
  };
});
