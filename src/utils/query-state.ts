import { ref, computed, watch } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";
import type { UseQueryResponse, AnyVariables } from "@urql/vue";
import { refThrottled } from "@vueuse/core";

import State from "@/utils/LoadingState";

export interface UseQueryStateOptions<T, V extends AnyVariables> {
  isNull?: (query: UseQueryResponse<T, V>) => boolean;
  isEmpty?: (query: UseQueryResponse<T, V>) => boolean;
}

export function useQueryState<T, V extends AnyVariables>(
  query: UseQueryResponse<T, V>,
  options: UseQueryStateOptions<T, V> = {}
) {
  const { isNull, isEmpty } = options;

  const init = ref(true);
  const error = ref<string | null>(null);

  watch(query.data, (data) => {
    if (data) init.value = false;
  });
  watch(query.error, (e) => {
    init.value = false;
    error.value = e?.message || null;
  });

  const devtoolState = ref(State.Off);
  watch(devtoolState, (val) => {
    if (val) init.value = val === State.Init;
    error.value = val === State.Error ? "Error from Dev Tools" : null;
  });

  const state = computed(() => {
    if (devtoolState.value !== State.Off) return devtoolState.value;
    if (refreshing.value) return State.Loading;
    if (query.fetching.value) return State.Loading;
    if (error.value) return State.Error;
    if (isEmpty?.(query)) return State.Empty;
    if (isNull?.(query)) return State.None;
    return State.Loaded;
  });

  const store = useStore();
  watch(
    () => store.nApolloMutations,
    () => {
      query.executeQuery({ requestPolicy: "network-only" });
    }
  );

  const { refreshing, refreshError, refresh } = useRefresh(query);

  watch(refreshError, (e) => {
    error.value = e;
  });

  return {
    init,
    error,
    devtoolState,
    loading: computed(() => state.value === State.Loading),
    loaded: computed(() => state.value === State.Loaded),
    empty: computed(() => state.value === State.Empty),
    notFound: computed(() => state.value === State.None),
    refresh,
  };
}

function useRefresh<T, V extends AnyVariables>(query: UseQueryResponse<T, V>) {
  const _refreshing = ref(false);

  // Throttle so as to avoid flickering
  const refreshing = refThrottled(_refreshing, 300);

  const refreshError = ref<string | null>(null);

  async function refresh() {
    _refreshing.value = true;
    try {
      const { error } = await query.executeQuery({
        requestPolicy: "network-only",
      });
      if (error.value) throw error.value;
    } catch (e: any) {
      refreshError.value = e?.toString() || null;
    } finally {
      _refreshing.value = false;
    }
  }

  return { refreshing, refreshError, refresh };
}
