import { storeToRefs } from "pinia";

import { useConfigStore } from "@/stores/config";

export function useConfig() {
  const store = useConfigStore();
  const { webConfig } = storeToRefs(store);
  const config = { config: webConfig };
  return config;
}
