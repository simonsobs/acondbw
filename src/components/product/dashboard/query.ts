import { computed, ref } from "vue";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

export function useQuery() {
  const query = useAllProductTypesQuery();
  const connection = computed(() => query.data?.value?.allProductTypes);
  const notFound = computed(() => connection.value === null);
  const edges = computed(
    () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
  );
  const nodes = computed(() => edges.value.flatMap((e) => e.node || []));
  const empty = computed(() => nodes.value.length === 0);

  const loading = ref(query.fetching);
  const error = ref(query.error);
  const refresh = async () =>
    await query.executeQuery({ requestPolicy: "network-only" });

  return {
    query,
    connection,
    edges,
    nodes,
    notFound,
    empty,
    loading,
    error,
    refresh,
  };
}
