import { ref, computed, watch } from "vue";
import { useStore } from "@/stores/main";
import { useQuery, AnyVariables, CombinedError } from "@urql/vue";

import State from "@/utils/LoadingState";

export function useQueryState<T = any, V extends AnyVariables = AnyVariables>(
  query: ReturnType<typeof useQuery<T, V>>,
  options: {
    isNull?: (query: ReturnType<typeof useQuery<T, V>>) => boolean;
    isEmpty?: (query: ReturnType<typeof useQuery<T, V>>) => boolean;
  } = {}
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

  const devtoolState = ref<number>(State.OFF);
  watch(devtoolState, (val) => {
    if (val) init.value = val === State.INIT;
    error.value = val === State.ERROR ? "Error from Dev Tools" : null;
  });

  const state = computed(() => {
    if (devtoolState.value !== State.OFF) return devtoolState.value;
    if (refreshing.value) return State.LOADING;
    if (query.fetching.value) return State.LOADING;
    if (error.value) return State.ERROR;
    if (isEmpty?.(query)) return State.EMPTY;
    if (isNull?.(query)) return State.NONE;
    return State.LOADED;
  });

  const store = useStore();
  watch(
    () => store.nApolloMutations,
    () => {
      query.executeQuery({ requestPolicy: "network-only" });
    }
  );

  const refreshing = ref(false);
  async function refresh() {
    refreshing.value = true;
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const { error } = await query.executeQuery({
        requestPolicy: "network-only",
      });
      if (error.value) throw error.value;
    } catch (e: any) {
      error.value = e?.toString() || null;
    } finally {
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      refreshing.value = false;
    }
  }

  return {
    init,
    error,
    devtoolState,
    loading: computed(() => state.value === State.LOADING),
    loaded: computed(() => state.value === State.LOADED),
    empty: computed(() => state.value === State.EMPTY),
    notFound: computed(() => state.value === State.NONE),
    refresh,
  };
}
