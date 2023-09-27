import { ref, computed } from "vue";
import type { Ref } from "vue";

interface Query {
  loading: Ref<boolean>;
  error: Ref<Error | undefined>;
  empty: Ref<boolean>;
  notFound: Ref<boolean>;
}

export function useOverride(query: Query) {
  const override = ref({
    loading: false,
    error: false,
    empty: false,
    notFound: false,
  });

  const loading = computed(() => override.value.loading || query.loading.value);
  const empty = computed(() => override.value.empty || query.empty.value);
  const notFound = computed(
    () => override.value.notFound || query.notFound.value
  );

  const error = computed(() =>
    override.value.error ? new Error("test") : query.error.value
  );

  return { override, loading, empty, notFound, error };
}
