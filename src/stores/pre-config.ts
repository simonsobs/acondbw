import { ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as path from "path";

interface PreConfig {
  graphqlHttp?: string;
}

export const usePreConfigStore = defineStore("preConfig", () => {
  const url = ref(path.join(import.meta.env.VITE_PUBLIC_PATH, "config.json"));
  const loading = ref(true);
  const error = ref<any>(null);
  const preConfig = ref<PreConfig>();

  watchEffect(async () => {
    error.value = null;
    try {
      const response = await axios.get<PreConfig>(url.value);
      preConfig.value = response.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  });

  return {
    url,
    loading,
    error,
    preConfig,
  };
});
