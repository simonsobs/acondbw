import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";
import * as path from "path";

export interface PreConfig {
  graphqlHttp: string;
}

export const usePreConfigStore = defineStore("preConfig", () => {
  const url = ref(path.join(import.meta.env.VITE_PUBLIC_PATH, "config.json"));

  const {
    data: preConfig,
    error: axiosError,
    isLoading: loading,
  } = useAxios<PreConfig>(url.value);

  const typeError = computed(() => {
    if(loading.value) return;
    if(!preConfig.value) return Error("preConfig is null");
    if (typeof preConfig.value.graphqlHttp !== "string")
      return Error("graphqlHttp is not string");
    if (preConfig.value?.graphqlHttp === "")
      return Error("graphqlHttp is empty");
  });

  const error = computed(() => axiosError.value || typeError.value);

  return {
    url,
    loading,
    error,
    preConfig,
  };
});
