import { provide, inject, watchEffect, Ref, InjectionKey } from "vue";
import { storeToRefs } from "pinia";
import { Client, useClientHandle } from "@urql/vue";

import { useStore } from "@/stores/main";

type WebConfig = ReturnType<typeof useStore>["webConfig"];
interface Config {
  config?: Ref<WebConfig>;
}

export const injectionKey: InjectionKey<Config> = Symbol("config");

export function provideConfig(urqlClient: Ref<Client>) {
  const store = useStore();
  const { webConfig } = storeToRefs(store);
  watchEffect(async () => {
    await store.loadWebConfig(urqlClient.value);
  });
  const config = { config: webConfig };
  provide(injectionKey, config);
  return config;
}

export function useConfig() {
  const config = inject(injectionKey, {});
  return config;
}
