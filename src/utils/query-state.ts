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
  const executeQuery = async () =>
    await query.executeQuery({ requestPolicy: "network-only" });

  useExecuteQueryOnMutation(executeQuery);

  const state = useState(query, executeQuery, isEmpty, isNull);

  return { ...state };
}

function useExecuteQueryOnMutation(executeQuery: () => Promise<any>) {
  const store = useStore();
  watch(
    () => store.nApolloMutations,
    async () => {
      await executeQuery();
    }
  );
}

function useState<T, V extends AnyVariables>(
  query: UseQueryResponse<T, V>,
  executeQuery: () => Promise<any>,
  isEmpty: ((query: UseQueryResponse<T, V>) => boolean) | undefined,
  isNull: ((query: UseQueryResponse<T, V>) => boolean) | undefined
) {
  const devtoolState = ref<State>("off");
  watch(devtoolState, (val) => {
    error.value = val === "error" ? "Error from Dev Tools" : null;
  });

  const error = useError(query);

  const { refreshing, refresh } = useRefresh(executeQuery);

  const state = computed<State>(() => {
    if (devtoolState.value !== "off") return devtoolState.value;
    if (refreshing.value) return "loading";
    if (query.fetching.value) return "loading";
    if (error.value) return "error";
    if (isEmpty?.(query)) return "empty";
    if (isNull?.(query)) return "none";
    return "loaded";
  });

  return {
    loading: computed(() => state.value === "loading"),
    loaded: computed(() => state.value === "loaded"),
    empty: computed(() => state.value === "empty"),
    notFound: computed(() => state.value === "none"),
    refreshing,
    refresh,
    error,
    devtoolState,
  };
}

function useError(query: { error: Ref<Error | undefined> }) {
  const error = ref<string | null>(null);
  watch(query.error, (e) => {
    error.value = e?.message || null;
  });
  return error;
}

function useRefresh(executeQuery: () => Promise<any>) {
  const _refreshing = ref(false);

  // Throttle so as to avoid flickering
  const refreshing = refThrottled(_refreshing, 300);

  async function refresh() {
    _refreshing.value = true;
    await executeQuery();
    _refreshing.value = false;
  }

  return { refreshing, refresh };
}
