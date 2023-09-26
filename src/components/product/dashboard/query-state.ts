import { ref, computed, watch, unref } from "vue";
import type { Ref, MaybeRef } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";
import { refThrottled } from "@vueuse/core";

import State from "@/utils/LoadingState";

export interface UseQueryStateOptions {
  isNull?: MaybeRef<boolean>;
  isEmpty?: MaybeRef<boolean>;
}

interface Query {
  fetching: Ref<boolean>;
  error: Ref<Error | undefined>;
  executeQuery: (opts?: { requestPolicy?: "network-only" }) => unknown;
}

export function useQueryState(query: Query, options?: UseQueryStateOptions) {
  const { isNull = false, isEmpty = false } = options ?? {};
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

function useState(
  query: { fetching: Ref<boolean>; error: Ref<Error | undefined> },
  executeQuery: () => Promise<any>,
  isEmpty: MaybeRef<boolean>,
  isNull: MaybeRef<boolean>
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
    if (unref(isEmpty)) return "empty";
    if (unref(isNull)) return "none";
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
