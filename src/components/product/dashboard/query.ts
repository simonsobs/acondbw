import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

import type { Connection } from "./type";

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

function useConnection<Node>(
  connection: Ref<Connection<Node> | null | undefined>
) {
  const notFound = computed(() => connection.value === null);
  const edges = computed(
    () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
  );
  const nodes = computed<Node[]>(() =>
    edges.value.flatMap((e) => e.node || [])
  );
  const empty = computed(() => nodes.value.length === 0);

  return { notFound, edges, nodes, empty };
}
