import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

export function useQuery() {
  const query = useAllProductTypesQuery();
  const connection = computed(() => query.data?.value?.allProductTypes);

  const loading = ref(query.fetching);
  const error = ref(query.error);
  const refresh = async () =>
    await query.executeQuery({ requestPolicy: "network-only" });

  const { notFound, edges, nodes, empty } = useConnection(connection);

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

interface Edge<T> {
  node?: T | null | undefined;
}

interface Connection<T> {
  edges: (Edge<T> | null)[];
}

function useConnection<T>(connection: Ref<Connection<T> | null | undefined>) {
  const notFound = computed(() => connection.value === null);
  const edges = computed(
    () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
  );
  const nodes = computed(() => edges.value.flatMap((e) => e.node || []));
  const empty = computed(() => nodes.value.length === 0);

  return { notFound, edges, nodes, empty };
}
