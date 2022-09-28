import { provide, inject, watchEffect, ref, Ref, InjectionKey } from "vue";
import { storeToRefs } from "pinia";
import { Client, useClientHandle } from "@urql/vue";

import { useStore } from "@/stores/main";

type WebConfig = ReturnType<typeof useStore>["webConfig"];
interface Config {
  config: Ref<WebConfig>;
  loaded: Ref<boolean>;
  set: (config: WebConfig) => void;
  upload: () => Promise<void>;
}

export const injectionKey: InjectionKey<Config> = Symbol("config");

export function provideConfig(urqlClient: Ref<Client>) {
  const store = useStore();
  const { webConfig, webConfigLoaded } = storeToRefs(store);
  watchEffect(async () => {
    await store.loadWebConfig(urqlClient.value);
  });
  const config = {
    config: webConfig,
    loaded: webConfigLoaded,
    set: (config: WebConfig) => {
      store.setWebConfig(config);
    },
    upload: async () => {
      await store.uploadWebConfig(urqlClient.value);
    },
  };
  provide<Config>(injectionKey, config);
  return config;
}

export function useConfig() {
  const defaultValue: Config = {
    config: ref({}),
    loaded: ref(false),
    set: () => {},
    upload: async () => {},
  }; // mainly for testing
  const config = inject<Config>(injectionKey, defaultValue);
  return config;
}
