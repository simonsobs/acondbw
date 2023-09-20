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

  const error = useError(query);

  const devtoolState = ref(State.Off);
  watch(devtoolState, (val) => {
    error.value = val === State.Error ? "Error from Dev Tools" : null;
  });

  useExecuteQueryOnMutation(query);

  const state = useState(query, devtoolState, error, isEmpty, isNull);

  return {
    error,
    devtoolState,
    ...state,
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
  error: Ref<string | null>,
  isEmpty: ((query: UseQueryResponse<T, V>) => boolean) | undefined,
  isNull: ((query: UseQueryResponse<T, V>) => boolean) | undefined
) {
  const { refreshing, refresh } = useRefresh(query);

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
    refreshing,
    refresh,
  };
}

function useError(query: UseQueryResponse<T, V>) {
  const error = ref<string | null>(null);
  watch(query.error, (e) => {
    error.value = e?.message || null;
  });
  return error;
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
