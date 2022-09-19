import { ref, computed, watch } from "vue";
import { useStore } from "@/stores/main";
import { useQuery, AnyVariables } from "@urql/vue";


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

  const devtoolState = ref<number | null>(null);
  watch(devtoolState, (val) => {
    if (val) init.value = val === State.INIT;
    error.value = val === State.ERROR ? "Error from Dev Tools" : null;
  });

  const state = computed(() => {
    if (devtoolState.value !== null) return devtoolState.value;
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
      console.log("nApolloMutations changed", store.nApolloMutations);
      query.executeQuery({ requestPolicy: "network-only" });
    }
  );

  return {
    init,
    error,
    devtoolState,
    loading: computed(() => state.value === State.LOADING),
    loaded: computed(() => state.value === State.LOADED),
    empty: computed(() => state.value === State.EMPTY),
    notFound: computed(() => state.value === State.NONE),
  };
}
