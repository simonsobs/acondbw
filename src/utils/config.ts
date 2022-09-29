import { storeToRefs } from "pinia";

import { useConfigStore } from "@/stores/config";

export function useConfig() {
  const store = useConfigStore();
  const { config } = storeToRefs(store);
  return { config };
}
