import { watchEffect, Ref } from "vue";
import { storeToRefs } from "pinia";
import { Client as UrqlClient } from "@urql/vue";

import { useStore } from "@/stores/main";

export function useConfig(urqlClient: Ref<UrqlClient>) {
  const store = useStore();
  const { webConfig } = storeToRefs(store);
  watchEffect(async () => {
    await store.loadWebConfig(urqlClient.value);
  });
  return { config: webConfig };
}
