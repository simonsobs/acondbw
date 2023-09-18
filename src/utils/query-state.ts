import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
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

  useExecuteQueryOnMutation(query);

  const { refreshing, refresh } = useRefresh(query);

  const { loading, loaded, empty, notFound } = useState(
    query,
    devtoolState,
    refreshing,
    error,
    isEmpty,
    isNull
  );

  return {
    init,
    error,
    devtoolState,
    refresh,
    loading,
    loaded,
    empty,
    notFound,
  };
}

function useExecuteQueryOnMutation<T, V extends AnyVariables>(
  query: UseQueryResponse<T, V>
) {
  const store = useStore();
  watch(
    () => store.nApolloMutations,
    () => {
      query.executeQuery({ requestPolicy: "network-only" });
    }
  );
}

function useState<T, V extends AnyVariables>(
  query: UseQueryResponse<T, V>,
  devtoolState: Ref<State>,
  refreshing: Ref<boolean>,
  error: Ref<string | null>,
  isEmpty: ((query: UseQueryResponse<T, V>) => boolean) | undefined,
  isNull: ((query: UseQueryResponse<T, V>) => boolean) | undefined
) {
  const state = computed(() => {
    if (devtoolState.value !== State.Off) return devtoolState.value;
    if (refreshing.value) return State.Loading;
    if (query.fetching.value) return State.Loading;
    if (error.value) return State.Error;
    if (isEmpty?.(query)) return State.Empty;
    if (isNull?.(query)) return State.None;
    return State.Loaded;
  });
  return {
    loading: computed(() => state.value === State.Loading),
    loaded: computed(() => state.value === State.Loaded),
    empty: computed(() => state.value === State.Empty),
    notFound: computed(() => state.value === State.None),
  };
}

function useRefresh<T, V extends AnyVariables>(query: UseQueryResponse<T, V>) {
  const _refreshing = ref(false);

  // Throttle so as to avoid flickering
  const refreshing = refThrottled(_refreshing, 300);

  async function refresh() {
    _refreshing.value = true;
    await query.executeQuery({ requestPolicy: "network-only" });
    _refreshing.value = false;
  }

  return { refreshing, refresh };
}
