import { provide, inject, watchEffect, ref, Ref, InjectionKey } from "vue";
import { storeToRefs } from "pinia";
import { Client, useClientHandle } from "@urql/vue";

import { useStore } from "@/stores/main";

type WebConfig = ReturnType<typeof useStore>["webConfig"];
interface Config {
  config: Ref<WebConfig>;
  loaded: Ref<boolean>;
}

export const injectionKey: InjectionKey<Config> = Symbol("config");

export function provideConfig(urqlClient: Ref<Client>) {
  const store = useStore();
  const { webConfig, webConfigLoaded } = storeToRefs(store);
  watchEffect(async () => {
    await store.loadWebConfig(urqlClient.value);
  });
  const config = { config: webConfig, loaded: webConfigLoaded };
  provide(injectionKey, config);
  return config;
}

export function useConfig() {
  const defaultValue = { config: ref({}), loaded: ref(false) }; // mainly for testing
  const config = inject(injectionKey, defaultValue);
  return config;
}
