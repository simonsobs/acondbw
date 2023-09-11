import { computed } from "vue";
import { useTitle } from "@vueuse/core";
import { useConfigStore } from "@/plugins/pinia/stores/config";

function useSetTitle() {
  const configStore = useConfigStore();
  const title = computed(() => configStore.config?.headTitle || "loading...");

  // https://vueuse.org/core/useTitle/
  return useTitle(title);
}

export { useSetTitle };
